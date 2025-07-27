import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from '../layout/RootLayout';
import ChargePage from '../pages/charge/chargePage';
import ModalProvider from '../components/Modal/context/ModalProvider';
import RaffleDetailPage from '../pages/raffleDetail/RaffleDetailPage';
import KakaoRedirect from '../pages/redirect/KakaoRedirect';
import RaffleUploadPage from '../pages/raffleUpload/RaffleUploadPage';
import WriteReview from '../pages/writeReview/writeReview';
import AddressSetPage from '../pages/address/addressSetPage';
import HomePage from '../pages/homepage/homePage';
import SetOpenInfoPage from '../pages/mypage/setOpenInfoPage';
import RaffleListPage from '../pages/raffleList/RaffleListPage';
import ResultPage from '../pages/hostResult/HostResultPage';
import SearchResultPage from '../pages/raffleList/SearchResultPage';
import CategoryResultPage from '../pages/raffleList/CategoryResultPage';
import MyProfilePage from '../pages/mypage/mypage';
import FollowingList from '../pages/mypage/FollowingList';
import Setting from '../pages/mypage/Setting';
import ScrollToTop from '../components/ScrollTop';
import AskPage from '../pages/ask/askPage';
import MyReview from '../pages/mypage/MyReview';
import Payment from '../pages/mypage/Payment';
import WinnerPage from '../pages/winner/winnerPage';
import UserProfilePage from '../pages/mypage/UserProfilePage';
import PrivateRoute from '../services/PrivateRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div>
        <ScrollToTop />
        <RootLayout />
        <ModalProvider />
      </div>
    ),
    children: [
      {
        element: <PrivateRoute />,
        children: [
          {
            path: 'change',
            element: (
              <div>
                <ChargePage />
                <ModalProvider />
              </div>
            ),
          },
          {
            path: 'raffle-upload',
            element: <RaffleUploadPage />,
          },
          // {
          //   path: 'review',
          //   element: <WriteReview />,
          // },
          {
            path: 'mypage/address',
            element: (
              <>
                <AddressSetPage />
                <ModalProvider />
              </>
            ),
          },
          {
            path: 'host-result',
            element: (
              <div>
                <ResultPage />
                <ModalProvider />
              </div>
            ),
          },
          {
            path: 'mypage/following-list',
            element: <FollowingList />,
          },
          {
            path: 'mypage/setting',
            element: <Setting />,
          },
          {
            path: 'mypage',
            element: <MyProfilePage />,
          },
          {
            path: 'mypage/public-information-set',
            element: <SetOpenInfoPage />,
          },
          {
            path: 'mypage/my-review',
            element: <MyReview />,
          },
          {
            path: 'mypage/payment',
            element: <Payment />,
          },
          {
            path: 'user/:userId',
            element: <UserProfilePage />,
          },
          {
            path: 'winner-page',
            element: <WinnerPage />,
          },
        ],
      },
      {
        path: 'review',
        element: <WriteReview />,

      },
      {
        path: 'mypage/my-review',
        element: <MyReview />,
      },
      {
        path: 'mypage/payment',
        element: <Payment />,
      },
      {
        path: 'user/:userId',
        element: <UserProfilePage />,
      },
      {
        path: 'winner-page',
        element: <WinnerPage />,
      },

      {
        path: '',
        element: (
          <div>
            <HomePage />
            <ModalProvider />
          </div>
        ),
      },
      {
        path: 'raffles/:type', // 래플 상세보기
        element: (
          <div>
            <RaffleDetailPage />
            <ModalProvider />
          </div>
        ),
      },
      {
        path: 'kakao',
        element: (
          <div>
            <KakaoRedirect />
            <ModalProvider />
          </div>
        ),
      },
      {
        path: '/raffles/list/:type', //더보기
        element: <RaffleListPage />,
      },
      {
        path: '/search/:type', // 검색결과 조회
        element: <SearchResultPage />,
      },
      {
        path: '/search/', // 검색결과 조회
        element: (
          <div>
            <HomePage />
            <ModalProvider />
          </div>
        ),
      },
      {
        path: '/categories/:type',
        element: <CategoryResultPage />,
      },
      {
        path: 'ask/:type',
        element: <AskPage />,
      },
    ],
  },
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
