import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartComponent } from './components/start/start.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { BlockComponent } from './components/block/block.component';
import { AddressComponent } from './components/address/address.component';
import { MasterPageComponent } from './components/master-page/master-page.component';
import { AboutComponent } from './components/about/about.component';
import { TelevisionComponent } from './components/television/television.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { MempoolBlockComponent } from './components/mempool-block/mempool-block.component';
import { AssetComponent } from './components/asset/asset.component';
import { AssetsNavComponent } from './components/assets/assets-nav/assets-nav.component';
import { StatusViewComponent } from './components/status-view/status-view.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LatestBlocksComponent } from './components/latest-blocks/latest-blocks.component';
import { TermsOfServiceComponent } from './components/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TrademarkPolicyComponent } from './components/trademark-policy/trademark-policy.component';
import { BisqMasterPageComponent } from './components/bisq-master-page/bisq-master-page.component';
import { SponsorComponent } from './components/sponsor/sponsor.component';
import { LiquidMasterPageComponent } from './components/liquid-master-page/liquid-master-page.component';
import { PushTransactionComponent } from './components/push-transaction/push-transaction.component';
import { PoolRankingComponent } from './components/pool-ranking/pool-ranking.component';
import { AssetGroupComponent } from './components/assets/asset-group/asset-group.component';
import { AssetsFeaturedComponent } from './components/assets/assets-featured/assets-featured.component';
import { AssetsComponent } from './components/assets/assets.component';
import { PoolComponent } from './components/pool/pool.component';
import { MiningDashboardComponent } from './components/mining-dashboard/mining-dashboard.component';
import { HashrateChartComponent } from './components/hashrate-chart/hashrate-chart.component';
import { HashrateChartPoolsComponent } from './components/hashrates-chart-pools/hashrate-chart-pools.component';
import { MiningStartComponent } from './components/mining-start/mining-start.component';
import { GraphsComponent } from './components/graphs/graphs.component';
import { BlocksList } from './components/blocks-list/blocks-list.component';
import { BlockFeesGraphComponent } from './components/block-fees-graph/block-fees-graph.component';
import { BlockRewardsGraphComponent } from './components/block-rewards-graph/block-rewards-graph.component';
import { BlockFeeRatesGraphComponent } from './components/block-fee-rates-graph/block-fee-rates-graph.component';
import { BlockSizesWeightsGraphComponent } from './components/block-sizes-weights-graph/block-sizes-weights-graph.component';

let routes: Routes = [
  {
    path: '',
    component: MasterPageComponent,
    children: [
      {
        path: 'tx/push',
        component: PushTransactionComponent,
      },
      {
        path: '',
        component: StartComponent,
        children: [
          {
            path: '',
            component: DashboardComponent,
          },
          {
            path: 'tx/:id',
            component: TransactionComponent
          },
          {
            path: 'block/:id',
            component: BlockComponent
          },
          {
            path: 'mempool-block/:id',
            component: MempoolBlockComponent
          },
          {
            path: 'mining',
            component: MiningDashboardComponent,
          },
        ],
      },
      {
        path: 'blocks',
        component: LatestBlocksComponent,
      },
      {
        path: 'mining',
        component: MiningStartComponent,
        children: [
          {
            path: 'blocks',
            component: BlocksList,
          },
          {
            path: 'pool',
            children: [
              {
                path: ':slug',
                component: PoolComponent,
              },
            ]
          },
        ]
      },
      {
        path: 'graphs',
        component: GraphsComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'mempool',
          },
          {
            path: 'mempool',
            component: StatisticsComponent,
          },
          {
            path: 'mining/hashrate-difficulty',
            component: HashrateChartComponent,
          },
          {
            path: 'mining/pools-dominance',
            component: HashrateChartPoolsComponent,
          },
          {
            path: 'mining/pools',
            component: PoolRankingComponent,
          },
          {
            path: 'mining/block-fees',
            component: BlockFeesGraphComponent,
          },
          {
            path: 'mining/block-rewards',
            component: BlockRewardsGraphComponent,
          },
          {
            path: 'mining/block-fee-rates',
            component: BlockFeeRatesGraphComponent,
          },
          {
            path: 'mining/block-sizes-weights',
            component: BlockSizesWeightsGraphComponent,
          },
        ],
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'docs',
        loadChildren: () => import('./docs/docs.module').then(m => m.DocsModule)
      },
      {
        path: 'api',
        loadChildren: () => import('./docs/docs.module').then(m => m.DocsModule)
      },
      {
        path: 'terms-of-service',
        component: TermsOfServiceComponent
      },
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent
      },
      {
        path: 'trademark-policy',
        component: TrademarkPolicyComponent
      },
      {
        path: 'address/:id',
        children: [],
        component: AddressComponent
      },
    ],
  },
  {
    path: 'testnet',
    children: [
      {
        path: '',
        component: MasterPageComponent,
        children: [
          {
            path: 'tx/push',
            component: PushTransactionComponent,
          },
          {
            path: '',
            component: StartComponent,
            children: [
              {
                path: '',
                component: DashboardComponent
              },
              {
                path: 'tx/:id',
                component: TransactionComponent
              },
              {
                path: 'block/:id',
                component: BlockComponent
              },
              {
                path: 'mempool-block/:id',
                component: MempoolBlockComponent
              },
              {
                path: 'mining',
                component: MiningDashboardComponent,
              },
            ],
          },
          {
            path: 'blocks',
            component: LatestBlocksComponent,
          },
          {
            path: 'mining',
            component: MiningStartComponent,
            children: [
              {
                path: 'blocks',
                component: BlocksList,
              },
              {
                path: 'pool',
                children: [
                  {
                    path: ':slug',
                    component: PoolComponent,
                  },
                ]
              },
            ]
          },
          {
            path: 'graphs',
            component: GraphsComponent,
            children: [
              {
                path: '',
                pathMatch: 'full',
                redirectTo: 'mempool',
              },
              {
                path: 'mempool',
                component: StatisticsComponent,
              },
              {
                path: 'mining/hashrate-difficulty',
                component: HashrateChartComponent,
              },
              {
                path: 'mining/pools-dominance',
                component: HashrateChartPoolsComponent,
              },
              {
                path: 'mining/pools',
                component: PoolRankingComponent,
              },
              {
                path: 'mining/block-fees',
                component: BlockFeesGraphComponent,
              },
              {
                path: 'mining/block-rewards',
                component: BlockRewardsGraphComponent,
              },
              {
                path: 'mining/block-fee-rates',
                component: BlockFeeRatesGraphComponent,
              },
              {
                path: 'mining/block-sizes-weights',
                component: BlockSizesWeightsGraphComponent,
              },
            ]
          },
          {
            path: 'address/:id',
            children: [],
            component: AddressComponent
          },
          {
            path: 'docs',
            loadChildren: () => import('./docs/docs.module').then(m => m.DocsModule)
          },
          {
            path: 'api',
            loadChildren: () => import('./docs/docs.module').then(m => m.DocsModule)
          },
        ],
      },
      {
        path: 'tv',
        component: TelevisionComponent
      },
      {
        path: 'status',
        component: StatusViewComponent
      },
      {
        path: '**',
        redirectTo: '/testnet'
      },
    ]
  },
  {
    path: 'signet',
    children: [
      {
        path: '',
        component: MasterPageComponent,
        children: [
          {
            path: 'tx/push',
            component: PushTransactionComponent,
          },
          {
            path: '',
            component: StartComponent,
            children: [
              {
                path: '',
                component: DashboardComponent
              },
              {
                path: 'tx/:id',
                component: TransactionComponent
              },
              {
                path: 'block/:id',
                component: BlockComponent
              },
              {
                path: 'mempool-block/:id',
                component: MempoolBlockComponent
              },
              {
                path: 'mining',
                component: MiningDashboardComponent,
              },
            ],
          },
          {
            path: 'blocks',
            component: LatestBlocksComponent,
          },
          {
            path: 'mining',
            component: MiningStartComponent,
            children: [
              {
                path: 'blocks',
                component: BlocksList,
              },
              {
                path: 'pool',
                children: [
                  {
                    path: ':slug',
                    component: PoolComponent,
                  },
                ]
              },
            ]
          },
          {
            path: 'graphs',
            component: GraphsComponent,
            children: [
              {
                path: '',
                pathMatch: 'full',
                redirectTo: 'mempool',
              },
              {
                path: 'mempool',
                component: StatisticsComponent,
              },
              {
                path: 'mining/hashrate-difficulty',
                component: HashrateChartComponent,
              },
              {
                path: 'mining/pools-dominance',
                component: HashrateChartPoolsComponent,
              },
              {
                path: 'mining/pools',
                component: PoolRankingComponent,
              },
              {
                path: 'mining/block-fees',
                component: BlockFeesGraphComponent,
              },
              {
                path: 'mining/block-rewards',
                component: BlockRewardsGraphComponent,
              },
              {
                path: 'mining/block-fee-rates',
                component: BlockFeeRatesGraphComponent,
              },
              {
                path: 'mining/block-sizes-weights',
                component: BlockSizesWeightsGraphComponent,
              },
            ]
          },
          {
            path: 'address/:id',
            children: [],
            component: AddressComponent
          },
          {
            path: 'docs',
            loadChildren: () => import('./docs/docs.module').then(m => m.DocsModule)
          },
          {
            path: 'api',
            loadChildren: () => import('./docs/docs.module').then(m => m.DocsModule)
          },
        ],
      },
      {
        path: 'tv',
        component: TelevisionComponent
      },
      {
        path: 'status',
        component: StatusViewComponent
      },
      {
        path: '**',
        redirectTo: '/signet'
      },
    ]
  },
  {
    path: 'tv',
    component: TelevisionComponent,
  },
  {
    path: 'status',
    component: StatusViewComponent
  },
  {
    path: 'sponsor',
    component: SponsorComponent,
  },
  {
    path: '**',
    redirectTo: ''
  },
];

const browserWindow = window || {};
// @ts-ignore
const browserWindowEnv = browserWindow.__env || {};

if (browserWindowEnv && browserWindowEnv.BASE_MODULE === 'bisq') {
  routes = [{
    path: '',
    component: BisqMasterPageComponent,
    loadChildren: () => import('./bisq/bisq.module').then(m => m.BisqModule)
  }];
}

if (browserWindowEnv && browserWindowEnv.BASE_MODULE === 'liquid') {
  routes = [{
    path: '',
    component: LiquidMasterPageComponent,
    children: [
      {
        path: '',
        component: StartComponent,
        children: [
          {
            path: '',
            component: DashboardComponent
          },
          {
            path: 'tx/push',
            component: PushTransactionComponent,
          },
          {
            path: 'tx/:id',
            component: TransactionComponent
          },
          {
            path: 'block/:id',
            component: BlockComponent
          },
          {
            path: 'mempool-block/:id',
            component: MempoolBlockComponent
          },
        ],
      },
      {
        path: 'blocks',
        component: LatestBlocksComponent,
      },
      {
        path: 'graphs',
        component: GraphsComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'mempool',
          },
          {
            path: 'mempool',
            component: StatisticsComponent,
          }
        ]
      },
      {
        path: 'address/:id',
        component: AddressComponent
      },
      {
        path: 'assets',
        component: AssetsNavComponent,
        children: [
          {
            path: 'featured',
            component: AssetsFeaturedComponent,
          },
          {
            path: 'all',
            component: AssetsComponent,
          },
          {
            path: 'asset/:id',
            component: AssetComponent
          },
          {
            path: 'group/:id',
            component: AssetGroupComponent
          },
          {
            path: '**',
            redirectTo: 'featured'
          }
        ]
      },
      {
        path: 'docs',
        loadChildren: () => import('./docs/docs.module').then(m => m.DocsModule)
      },
      {
        path: 'api',
        loadChildren: () => import('./docs/docs.module').then(m => m.DocsModule)
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'terms-of-service',
        component: TermsOfServiceComponent
      },
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent
      },
      {
        path: 'trademark-policy',
        component: TrademarkPolicyComponent
      },
    ],
  },
  {
    path: 'testnet',
    children: [
      {
        path: '',
        component: LiquidMasterPageComponent,
        children: [
          {
            path: '',
            component: StartComponent,
            children: [
              {
                path: '',
                component: DashboardComponent
              },
              {
                path: 'tx/push',
                component: PushTransactionComponent,
              },
              {
                path: 'tx/:id',
                component: TransactionComponent
              },
              {
                path: 'block/:id',
                component: BlockComponent
              },
              {
                path: 'mempool-block/:id',
                component: MempoolBlockComponent
              },
            ],
          },
          {
            path: 'blocks',
            component: LatestBlocksComponent,
          },
          {
            path: 'graphs',
            component: GraphsComponent,
            children: [
              {
                path: '',
                pathMatch: 'full',
                redirectTo: 'mempool',
              },
              {
                path: 'mempool',
                component: StatisticsComponent,
              }
            ]
          },
          {
            path: 'address/:id',
            component: AddressComponent
          },
          {
            path: 'assets',
            component: AssetsNavComponent,
            children: [
              {
                path: 'all',
                component: AssetsComponent,
              },
              {
                path: 'asset/:id',
                component: AssetComponent
              },
              {
                path: 'group/:id',
                component: AssetGroupComponent
              },
              {
                path: '**',
                redirectTo: 'all'
              }
            ]
          },
          {
            path: 'docs',
            loadChildren: () => import('./docs/docs.module').then(m => m.DocsModule)
          },
          {
            path: 'api',
            loadChildren: () => import('./docs/docs.module').then(m => m.DocsModule)
          },
          {
            path: 'about',
            component: AboutComponent,
          },
          {
            path: 'terms-of-service',
            component: TermsOfServiceComponent
          },
          {
            path: 'privacy-policy',
            component: PrivacyPolicyComponent
          },
          {
            path: 'trademark-policy',
            component: TrademarkPolicyComponent
          },
        ],
      },
      {
        path: 'tv',
        component: TelevisionComponent
      },
      {
        path: 'status',
        component: StatusViewComponent
      },
    ]
  },
  {
    path: 'tv',
    component: TelevisionComponent
  },
  {
    path: 'status',
    component: StatusViewComponent
  },
  {
    path: '**',
    redirectTo: '/testnet'
  }];
}

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
})
export class AppRoutingModule { }

