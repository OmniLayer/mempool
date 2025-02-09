import config from '../../config';
import * as fs from 'fs';
import axios from 'axios';
import { BisqBlocks, BisqBlock, BisqTransaction, BisqStats, BisqTrade } from './interfaces';
import { Common } from '../common';
import { BlockExtended } from '../../mempool.interfaces';
import { StaticPool } from 'node-worker-threads-pool';
import logger from '../../logger';

class Bisq {
  private static BLOCKS_JSON_FILE_PATH = config.BISQ.DATA_PATH + '/json/all/blocks.json';
  private latestBlockHeight = 0;
  private blocks: BisqBlock[] = [];
  private allBlocks: BisqBlock[] = [];
  private transactions: BisqTransaction[] = [];
  private transactionIndex: { [txId: string]: BisqTransaction } = {};
  private blockIndex: { [hash: string]: BisqBlock } = {};
  private addressIndex: { [address: string]: BisqTransaction[] } = {};
  private stats: BisqStats = {
    minted: 0,
    burnt: 0,
    addresses: 0,
    unspent_txos: 0,
    spent_txos: 0,
  };
  private price: number = 0;
  private priceUpdateCallbackFunction: ((price: number) => void) | undefined;
  private topDirectoryWatcher: fs.FSWatcher | undefined;
  private subdirectoryWatcher: fs.FSWatcher | undefined;
  private jsonParsePool = new StaticPool({
    size: 4,
    task: (blob: string) => JSON.parse(blob),
  });

  constructor() {}

  startBisqService(): void {
    this.checkForBisqDataFolder();
    this.loadBisqDumpFile();
    setInterval(this.updatePrice.bind(this), 1000 * 60 * 60);
    this.updatePrice();
    this.startTopDirectoryWatcher();
    this.startSubDirectoryWatcher();
  }

  handleNewBitcoinBlock(block: BlockExtended): void {
    if (block.height - 10 > this.latestBlockHeight && this.latestBlockHeight !== 0) {
      logger.warn(`Bitcoin block height (#${block.height}) has diverged from the latest Bisq block height (#${this.latestBlockHeight}). Restarting watchers...`);
      this.startTopDirectoryWatcher();
      this.startSubDirectoryWatcher();
    }
  }

  getTransaction(txId: string): BisqTransaction | undefined {
    return this.transactionIndex[txId];
  }

  getTransactions(start: number, length: number, types: string[]): [BisqTransaction[], number] {
    let transactions = this.transactions;
    if (types.length) {
      transactions = transactions.filter((tx) => types.indexOf(tx.txType) > -1);
    }
    return [transactions.slice(start, length + start), transactions.length];
  }

  getBlock(hash: string): BisqBlock | undefined {
    return this.blockIndex[hash];
  }

  getAddress(hash: string): BisqTransaction[] {
    return this.addressIndex[hash];
  }

  getBlocks(start: number, length: number): [BisqBlock[], number] {
    return [this.blocks.slice(start, length + start), this.blocks.length];
  }

  getStats(): BisqStats {
    return this.stats;
  }

  setPriceCallbackFunction(fn: (price: number) => void) {
    this.priceUpdateCallbackFunction = fn;
  }

  getLatestBlockHeight(): number {
    return this.latestBlockHeight;
  }

  private checkForBisqDataFolder() {
    if (!fs.existsSync(Bisq.BLOCKS_JSON_FILE_PATH)) {
      logger.warn(Bisq.BLOCKS_JSON_FILE_PATH + ` doesn't exist. Make sure Bisq is running and the config is correct before starting the server.`);
      return process.exit(1);
    }
  }

  private startTopDirectoryWatcher() {
    if (this.topDirectoryWatcher) {
      this.topDirectoryWatcher.close();
    }
    let fsWait: NodeJS.Timeout | null = null;
    this.topDirectoryWatcher = fs.watch(config.BISQ.DATA_PATH + '/json', () => {
      if (fsWait) {
        clearTimeout(fsWait);
      }
      if (this.subdirectoryWatcher) {
        this.subdirectoryWatcher.close();
      }
      fsWait = setTimeout(() => {
        logger.debug(`Bisq restart detected. Resetting both watchers in 3 minutes.`);
        setTimeout(() => {
          this.startTopDirectoryWatcher();
          this.startSubDirectoryWatcher();
          this.loadBisqDumpFile();
        }, 180000);
      }, 15000);
    });
  }

  private startSubDirectoryWatcher() {
    if (this.subdirectoryWatcher) {
      this.subdirectoryWatcher.close();
    }
    if (!fs.existsSync(Bisq.BLOCKS_JSON_FILE_PATH)) {
      logger.warn(Bisq.BLOCKS_JSON_FILE_PATH + ` doesn't exist. Trying to restart sub directory watcher again in 3 minutes.`);
      setTimeout(() => this.startSubDirectoryWatcher(), 180000);
      return;
    }
    let fsWait: NodeJS.Timeout | null = null;
    this.subdirectoryWatcher = fs.watch(config.BISQ.DATA_PATH + '/json/all', () => {
      if (fsWait) {
        clearTimeout(fsWait);
      }
      fsWait = setTimeout(() => {
        logger.debug(`Change detected in the Bisq data folder.`);
        this.loadBisqDumpFile();
      }, 2000);
    });
  }

  private updatePrice() {
    axios.get<BisqTrade[]>('https://bisq.markets/api/trades/?market=bsq_btc', { timeout: 10000 })
      .then((response) => {
        const prices: number[] = [];
        response.data.forEach((trade) => {
          prices.push(parseFloat(trade.price) * 100000000);
        });
        prices.sort((a, b) => a - b);
        this.price = Common.median(prices);
        if (this.priceUpdateCallbackFunction) {
          this.priceUpdateCallbackFunction(this.price);
        }
    }).catch((err) => {
      logger.err('Error updating Bisq market price: ' + err);
    });
  }

  private async loadBisqDumpFile(): Promise<void> {
    this.allBlocks = [];
    try {
      await this.loadData();
      this.buildIndex();
      this.calculateStats();
    } catch (e) {
      logger.info('loadBisqDumpFile() error.' + (e instanceof Error ? e.message : e));
    }
  }

  private buildIndex() {
    const start = new Date().getTime();
    this.transactions = [];
    this.transactionIndex = {};
    this.addressIndex = {};

    this.allBlocks.forEach((block) => {
      /* Build block index */
      if (!this.blockIndex[block.hash]) {
        this.blockIndex[block.hash] = block;
      }

      /* Build transactions index */
      block.txs.forEach((tx) => {
        this.transactions.push(tx);
        this.transactionIndex[tx.id] = tx;
      });
    });

    /* Build address index */
    this.transactions.forEach((tx) => {
      tx.inputs.forEach((input) => {
        if (!this.addressIndex[input.address]) {
          this.addressIndex[input.address] = [];
        }
        if (this.addressIndex[input.address].indexOf(tx) === -1) {
          this.addressIndex[input.address].push(tx);
        }
      });
      tx.outputs.forEach((output) => {
        if (!this.addressIndex[output.address]) {
          this.addressIndex[output.address] = [];
        }
        if (this.addressIndex[output.address].indexOf(tx) === -1) {
          this.addressIndex[output.address].push(tx);
        }
      });
    });

    const time = new Date().getTime() - start;
    logger.debug('Bisq data index rebuilt in ' + time + ' ms');
  }

  private calculateStats() {
    let minted = 0;
    let burned = 0;
    let unspent = 0;
    let spent = 0;

    this.transactions.forEach((tx) => {
      tx.outputs.forEach((output) => {
        if (output.opReturn) {
          return;
        }
        if (output.txOutputType === 'GENESIS_OUTPUT' || output.txOutputType === 'ISSUANCE_CANDIDATE_OUTPUT' && output.isVerified) {
          minted += output.bsqAmount;
        }
        if (output.isUnspent) {
          unspent++;
        } else {
          spent++;
        }
      });
      burned += tx['burntFee'];
    });

    this.stats = {
      addresses: Object.keys(this.addressIndex).length,
      minted: minted / 100,
      burnt: burned / 100,
      spent_txos: spent,
      unspent_txos: unspent,
    };
  }

  private async loadData(): Promise<any> {
    if (!fs.existsSync(Bisq.BLOCKS_JSON_FILE_PATH)) {
      throw new Error(Bisq.BLOCKS_JSON_FILE_PATH + ` doesn't exist`);
    }

    const readline = require('readline');
    const events = require('events');

    const rl = readline.createInterface({
      input: fs.createReadStream(Bisq.BLOCKS_JSON_FILE_PATH),
      crlfDelay: Infinity
    });

    let blockBuffer = '';
    let readingBlock = false;
    let lineCount = 1;
    const start = new Date().getTime();

    logger.debug('Processing Bisq data dump...');

    rl.on('line', (line) => {
      if (lineCount === 2) {
        line = line.replace('  "chainHeight": ', '');
        this.latestBlockHeight = parseInt(line, 10);
      }

      if (line === '    {') {
        readingBlock = true;
      } else if (line === '    },') {
        blockBuffer += '}';
        try {
          const block: BisqBlock =  JSON.parse(blockBuffer);
          this.allBlocks.push(block);
          readingBlock = false;
          blockBuffer = '';
        } catch (e) {
          logger.debug(blockBuffer);
          throw Error(`Unable to parse Bisq data dump at line ${lineCount}` + (e instanceof Error ? e.message : e));
        }
      }

      if (readingBlock === true) {
        blockBuffer += line;
      }

      ++lineCount;
    });

    await events.once(rl, 'close');

    this.allBlocks.reverse();
    this.blocks = this.allBlocks.filter((block) => block.txs.length > 0);

    const time = new Date().getTime() - start;
    logger.debug('Bisq dump processed in ' + time + ' ms');
  }
}

export default new Bisq();
