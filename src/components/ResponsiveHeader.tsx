import styled from 'styled-components';
import media from '../styles/media';
import icLogo from '../assets/header/icon-logo.svg';
import icHamburger from '../assets/header/icon-hamburger.svg';
import ticket from '../assets/ticketLogo.png';
import { ReactComponent as IcNotice } from '../assets/header/icon-notice.svg';
import { ReactComponent as IcSetting } from '../assets/header/icon-setting.svg';
// import icSetting from '../assets/header/icon-setting.svg';
import icSearch from '../assets/header/icon-search.svg';
import icHeart from '../assets/header/icon-heart.svg';
import icMyPage from '../assets/header/icon-mypage.svg';
import icUpload from '../assets/header/icon-upload.svg';
import imgTicket from '../assets/ticket.svg';
import { useNavigate } from 'react-router-dom';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import CategoryMenu from './CategoryMenu';
import { useModalContext } from './Modal/context/ModalContext';
import SplashModal from '../pages/login/components/LogInModal';
import imgVector from '../assets/Vector.png';
import { ReactComponent as IcList } from '../assets/icList.svg';
import icDel from '../assets/icDel.svg';
import axiosInstance from '../apis/axiosInstance';
import { TSearch } from '../types/searchKeywords';
import { useAuth } from '../context/AuthContext';
import { useIsSearchCompleted } from '../store/store';
import { SyncOutlined, WysiwygOutlined } from '@mui/icons-material';

const ResponsiveHeader = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isCatClicked, setIsCatClicked] = useState<boolean>(false);
  const { openModal } = useModalContext();
  const [isSearchClicked, setIsSearchClicked] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [searchText, setSearchText] = useState<string>('');
  const categoryRef = useRef<HTMLDivElement>(null);
  const [hotKeywords, setHotKeywords] = useState<string[]>([]);
  const [recentKeywords, setRecentKeywords] = useState<string[]>([]);
  const { isAuthenticated, logout } = useAuth();
  const isSearchCompleted = useIsSearchCompleted((v) => v.isSearchCompleted);
  const [searchClicked, setSearchClicked] = useState<boolean>(false);
  const [isBusinessUser, setIsBusinessUser] = useState<boolean>(false);

  // 사용자의 비즈니스 상태 확인
  const checkBusinessStatus = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await axiosInstance.get('/api/member/mypage');
      if (response.data.isSuccess && response.data.result) {
        // API 응답에 is_business 필드가 있다고 가정
        setIsBusinessUser(response.data.result.is_business || false);
      }
    } catch (error) {
      console.error('비즈니스 상태 확인 실패:', error);
      setIsBusinessUser(false);
    }
  };

  const getSearch = async () => {
    const { data }: { data: TSearch } = await axiosInstance.get(
      isAuthenticated ? '/api/member/search' : '/api/permit/search',
    );

    console.log('recentSearch:', data.result.recentSearch);
    setHotKeywords(data.result.popularSearch);
    setRecentKeywords(data.result.recentSearch);
  };
  const delSearch = async (keyword: string) =>
    await axiosInstance.delete(`/api/member/search?keyword=${keyword}`);

  const handleClickLogo = () => {
    navigate('/');
    setSearchText('');
  };
  const handleCategoryOut = (e: MouseEvent) => {
    const currentCategoryRef = categoryRef.current;
    if (currentCategoryRef && !currentCategoryRef.contains(e.target as Node)) {
      setIsCatClicked(false);
      console.log('handleCategoryOut!');
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    const currentSearchRef = searchRef.current;
    if (currentSearchRef && !currentSearchRef.contains(e.target as Node)) {
      setIsSearchClicked(false);
    }
  };

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  const handleSearchEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate(`/search/${searchText}`);
      setIsSearchClicked(false);
    }
  };
  const clickSearchIcon = () => {
    navigate(`/search/${searchText}`);
    setIsSearchClicked(false);
  };

  const handleDelKeyword = (keyword: string) => {
    // delSearch(): 해당 키워드 서버에서 삭제
    delSearch(keyword).then((_) => getSearch());
  };

  const clickKeyword = (v: string) => {
    setSearchText(v);
    // console.log('searchText:', searchText, v);
    navigate(`/search/${v}`);
    setIsSearchClicked(false);
  };

  const handleOpenModal = () => {
    openModal(({ onClose }) => <SplashModal onClose={onClose} />);
  };
  const onClickLoginBtn = () => {
    if (!isAuthenticated) handleOpenModal();
    else logout();
  };

  // 시작하자마자 호출될 API
  useEffect(() => {
    getSearch();
  }, [isAuthenticated]);

  // 검색할 때마다 최신 검색어 갱신
  useEffect(() => {
    getSearch();
  }, [isSearchCompleted]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mousedown', handleCategoryOut);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousedown', handleCategoryOut);
    };
  }, [searchRef.current, categoryRef.current]);

  useEffect(() => {
    if (isAuthenticated) {
      checkBusinessStatus();
    } else {
      setIsBusinessUser(false);
    }
  }, [isAuthenticated]);

  return (
    <>
      <Wrapper>
        <TopContainer>
          <LoginBtn onClick={onClickLoginBtn} state={String(isAuthenticated)}>
            {isAuthenticated ? '로그아웃' : '로그인'}
          </LoginBtn>
          <LineDiv height={'27px'} margin={'0 32px'} className="line-1" />
          <NoticeIconDiv
            onClick={() => {
              if (isAuthenticated) {
                navigate('/notification'); // 알림 페이지
              } else {
                handleOpenModal();
              }
            }}
          >
            <IcNotice
              className="svg"
              width={18.65}
              height={21.32}
              fill={'#8F8E94'}
            />
            <IconTextDiv fontSize={'14px'}>알림</IconTextDiv>
          </NoticeIconDiv>
          <LineDiv height={'27px'} margin={'0 32px'} />
          <SettingIconDiv
            onClick={() => {
              if (isAuthenticated) {
                navigate('mypage/setting'); // 설정 페이지
              } else {
                handleOpenModal();
              }
            }}
          >
            <IcSetting
              className="svg"
              width={22}
              height={24}
              fill={'#8F8E94'}
            />
            <IconTextDiv fontSize={'14px'}>설정</IconTextDiv>
          </SettingIconDiv>
        </TopContainer>
        <SearchBoxContainer>
          <LogoImg src={icLogo} onClick={handleClickLogo} />
          <LogoRightContainer>
            <CategoryContainer ref={categoryRef}>
              <IconHamburgerDiv
                onMouseDown={() => {
                  isCatClicked ? setIsCatClicked(false) : setIsCatClicked(true);
                }}
              >
                <img src={icHamburger} width={22} />
                <IconTextDiv fontSize={'10px'}>카테고리</IconTextDiv>
              </IconHamburgerDiv>
              {isCatClicked && <CategoryMenu />}
            </CategoryContainer>
            <SearchBoxDiv>
              <TicketImg src={ticket} />
              <SearchInput
                type="search"
                onClick={() => setIsSearchClicked(true)}
                value={searchText}
                onChange={handleSearchInput}
                onKeyUp={handleSearchEnter}
              />
              <SearchIcon src={icSearch} onClick={clickSearchIcon} />
              <KeywordContainer ref={searchRef} $show={String(isSearchClicked)}>
                {isLoggedIn === false ? (
                  <KeywordBox>
                    <KeywordTitle>
                      <img src={imgVector} width={15} height={15} />
                      <Span>최근 검색</Span>
                    </KeywordTitle>
                    <RecentKeywordsBox>
                      {recentKeywords.length !== 0 ? (
                        recentKeywords.map((v, _) => (
                          <RecentKeyword key={_}>
                            <Keyword onClick={() => clickKeyword(v)}>
                              {v}
                            </Keyword>
                            <DelImg
                              src={icDel}
                              width={9.096}
                              height={8.901}
                              onClick={() => handleDelKeyword(v)}
                            />
                          </RecentKeyword>
                        ))
                      ) : (
                        <NoRecentKeywords>
                          최근 검색 내역이 없습니다.
                        </NoRecentKeywords>
                      )}
                    </RecentKeywordsBox>
                  </KeywordBox>
                ) : (
                  <></>
                )}
                <KeywordBox>
                  <KeywordTitle>
                    <img src={imgVector} width={15} height={15} />
                    <Span>현재 인기있는 검색어</Span>
                  </KeywordTitle>
                  <HotKeywordsBox>
                    {hotKeywords.map((v, _) => (
                      <HotKeyword key={_} onClick={() => clickKeyword(v)}>
                        <IcList
                          width={9}
                          height={9}
                          fill={'rgba(201, 8, 255, 0.20)'}
                        />
                        {v}
                      </HotKeyword>
                    ))}
                  </HotKeywordsBox>
                </KeywordBox>
              </KeywordContainer>
            </SearchBoxDiv>
            <IconLikeDiv
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/raffles/list/likes'); // 찜한래플
                } else {
                  handleOpenModal(); // 로그인 모달
                }
              }}
            >
              <img src={icHeart} width={22} />
              <IconTextDiv fontSize={'10px'}>찜한래플</IconTextDiv>
            </IconLikeDiv>
            <IconDiv
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/mypage');
                } else {
                  handleOpenModal(); // 로그인 모달 띄우기
                }
              }}
            >
              <img src={icMyPage} width={22} />
              <IconTextDiv fontSize={'10px'}>마이페이지</IconTextDiv>
            </IconDiv>
            <IconDiv
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/change'); // 충전/환전
                } else {
                  handleOpenModal();
                }
              }}
            >
              <Img src={imgTicket} height={18} />
              <IconTextDiv fontSize={'10px'}>충전/환전</IconTextDiv>
            </IconDiv>

            {/* 비즈니스 계정일 때만 래플 업로드 버튼 표시 */}
            {isBusinessUser && (
              <IconDiv
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/raffle-upload'); // 래플 업로드
                  } else {
                    handleOpenModal();
                  }
                }}
              >
                <img src={icUpload} width={22} />
                <IconTextDiv fontSize={'10px'}>래플 업로드</IconTextDiv>
              </IconDiv>
            )}
          </LogoRightContainer>
        </SearchBoxContainer>
      </Wrapper>
      <Line />
    </>
  );
};

export default ResponsiveHeader;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 1200px;
  height: 188px;
  box-sizing: border-box;
  z-index: 100;
  ${media.medium`
        width: 750px;
        // padding: 0 40px;
  `}
  ${media.small`
    width: 100vw;
    position: relative;
    padding-top: 27px;
    height: auto;
  `}
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 0 34px 26px 0;
  ${media.medium`
      margin-right: 10px;
  `}
  ${media.small`
    position: absolute;
    right: 0;
    top: 5em;
  `}
`;

const LoginBtn = styled.button<{ state: string }>`
  width: 99.355px;
  height: 26.644px;
  border-radius: 40px;
  ${(props) =>
    props.state === 'true'
      ? `border: 1px solid #8F8E94;
        background-color: transparent;
        color: #8F8E94;
        &:hover {
            border: 1px solid #000;
            color: #000;
        }
        `
      : `border: 1px solid #C908FF;
        background: rgba(201, 8, 255, 0.20);
        color: #C908FF;
        &:hover {
            border: 1px solid #C908FF;
            background: #C908FF;
            color: #FFF;
        };
        `}
  font-family: Pretendard;
  font-size: 15px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: -0.165px;
  cursor: pointer;
  ${media.medium`
      display: none;
    `}
`;

const IconTextDiv = styled.div<{
  fontSize: string;
  color?: string;
  fontWeight?: string;
}>`
  font-size: ${(props) => props.fontSize};
  color: ${(props) => props.color || '#8F8E94'};
  text-align: center;
  font-family: Pretendard;
  font-style: normal;
  font-weight: ${(props) => props.fontWeight || '600'};
  line-height: 18px;
  letter-spacing: -0.165px;
`;

const SearchBoxContainer = styled.div`
  display: flex;
  // justify-content: space-between;
  // justify-content: center;
  align-items: center;
  box-sizing: border-box;
  ${media.small`
    flex-direction: column;
    width: 390px;
  `}
`;

const LogoImg = styled.img`
  width: 133px;
  height: 64px;
  margin-right: 15px;
  margin-bottom: 5px;
  flex-shrink: 0;
  max-width: 100%;
  object-fit: contain;
  &:hover {
    cursor: pointer;
  }
  ${media.medium`
    width: 119px;
    height: 56px;
  `}
`;

const LogoRightContainer = styled.div`
  display: flex;
  ${media.small`
    margin-top: 75px;
    width: 358px;
  `}
`;

const CategoryContainer = styled.div`
  position: relative;
`;

const SearchBoxDiv = styled.div`
  position: relative;
  width: 700px;
  // flex: 1;
  // max-width: 700px;
  // min-width: 700px;
  height: 42px;
  border-radius: 51px;
  border: 1.5px solid #c908ff;
  box-sizing: border-box;
  padding: 3px 20px;
  display: flex;
  ${media.medium`
    width: 600px;
  `}
  ${media.small`
    width: 358px;
  `}
`;

const Img = styled.img`
  margin: 3px 0;
`;

const TicketImg = styled.img`
  width: 88px;
  position: absolute;
  bottom: 102%;
  left: 50%;
  transform: translateX(-50%);
  ${media.medium`
      width: 79px;
    `}
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  font-size: 18px;
  font-family: Pretendard;
  font-style: normal;
  line-height: 18px;
  letter-spacing: -0.165px;
`;

const SearchIcon = styled.img`
  cursor: pointer;
  width: 20.975px;
`;

const KeywordContainer = styled.div<{ $show: string }>`
  width: 560px;
  // width: 100%;
  // height: 386px;
  border-radius: 18px;
  border: 1px solid #e4e4e4;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 120%;
  transform: translateX(-50%);
  padding: 38px 43px 5px 43px;
  box-sizing: border-box;
  display: ${(props) => (props.$show === 'true' ? 'box' : 'none')};
`;
const KeywordBox = styled.div`
  box-sizing: border-box;
  min-height: 129px;
  padding-bottom: 37px;
`;
const KeywordTitle = styled.div`
  display: flex;
  align-items: baseline;
`;
const Span = styled.span`
  padding-left: 18px;
  padding-bottom: 19px;
  color: #000;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 18px; /* 128.571% */
  letter-spacing: -0.165px;
`;
const RecentKeywordsBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  row-gap: 17px;
  column-gap: 16px;
`;
const RecentKeyword = styled.div`
  width: 81px;
  height: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  gap: 9px;
  padding: 3px 7px 3px 15px;
  border-radius: 12px;
  background: #e4e4e4;
  box-sizing: border-box;

  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 36.832px; /* 306.932% */

  &:hover {
    cursor: default;
  }
`;
const Keyword = styled.span`
  display: inline-block;
  width: 41.01px;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const NoRecentKeywords = styled.span`
  color: #8f8e94;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 36.832px; /* 306.932% */
`;
const DelImg = styled.img`
  &:hover {
    cursor: pointer;
  }
`;
const HotKeywordsBox = styled.div`
  height: 148px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 17px;
`;
const HotKeyword = styled.div`
  width: 228px;
  display: flex;
  align-items: center;
  gap: 17px;

  color: #000;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  &:hover {
    cursor: pointer;
  }
`;

const NoticeIconDiv = styled.div`
  display: flex;
  column-gap: 11px;
  align-items: center;
  justify-content: space-evenly;
  height: 65px;
  cursor: pointer;
  &:hover > ${IconTextDiv} {
    color: #040404;
  }
  &:hover .svg {
    fill: #040404;
  }
  ${media.small`
    margin-right: 19px;
  `}
`;

const SettingIconDiv = styled.div`
  display: flex;
  column-gap: 11px;
  align-items: center;
  justify-content: space-evenly;
  height: 65px;
  cursor: pointer;
  &:hover > ${IconTextDiv} {
    color: #040404;
  }
  &:hover .svg {
    fill: #040404;
  }
  ${media.small`
    display: none;
  `}
`;

const IconDiv = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 6px;
  align-items: center;
  justify-content: space-evenly;
  height: 45px;
  min-width: 61px;
  // margin: 0 25px 0 0;
  cursor: pointer;
  &:hover > ${IconTextDiv} {
    color: #c908ff;
  }
`;
const IconLikeDiv = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 6px;
  align-items: center;
  justify-content: space-evenly;
  height: 45px;
  min-width: 61px;
  // margin: 0 25px 0 0;
  cursor: pointer;
  &:hover > ${IconTextDiv} {
    color: #c908ff;
  }
  ${media.small`
    display: none;
  `}
`;

const IconHamburgerDiv = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 6px;
  align-items: center;
  justify-content: space-between;
  height: 46px;
  min-width: 61px;
  cursor: pointer;
  &:hover > ${IconTextDiv} {
    color: #c908ff;
  }
`;

const LineDiv = styled.div<{ height: string; margin: string }>`
  width: 1px;
  height: ${(props) => props.height};
  background: #8f8e94;
  margin: ${(props) => props.margin};

  &.line-1 {
    ${media.medium`
        display: none;
      `}
  }
  ${media.small`
    display: none;
  `}
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background: #e4e4e4;
  ${media.small`
    margin-top: 20px;
  `}
`;
