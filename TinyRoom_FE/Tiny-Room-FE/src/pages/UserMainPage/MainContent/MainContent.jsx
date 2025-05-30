import { useLocation, useOutletContext, useParams } from "react-router-dom";
import {
  BoardBox,
  BoardContent,
  BoardFooter,
  BoardHeader,
  CategoryItem,
  CategoryList,
  Container,
  NoContent,
  WriteButton,
} from "./MainContent.style";
import MyRoom from "./MyRoom";
import { useCallback, useEffect, useState } from "react";
import useStore from "../../../stores/store";
import PostPreview from "./PostPreview";
import axios from "axios";
import MyPagination from "../../../components/Pagination/MyPagination";

const MainContent = () => {
  const location = useLocation();
  const userId = location.pathname.split("/")[1];
  const { id } = useParams();

  const token = localStorage.getItem("token");
  const { userInfo } = useStore();

  const { blogData } = useOutletContext();

  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const [posts, setPosts] = useState({
    data: [],
    totalCount: 0,
  });

  const [page, setPage] = useState(1);

  const handleFurnitureClick = useCallback((categoryIdx) => {
    setSelectedCategoryIdx(categoryIdx);
    setPage(1);
  }, []);

  const getPosts = useCallback(
    async (p, categoryIdx) => {
      const response = await axios.get(
        `http://localhost:8080/user/${userId}?category=${categoryIdx}&page=${
          p - 1
        }`
      );

      setPosts(response.data);
    },
    [userId]
  );

  useEffect(() => {
    getPosts(page, selectedCategoryIdx);
  }, [page, selectedCategoryIdx, userId]);

  const handlePageChange = useCallback((e, page) => {
    setPage(page);
  }, []);

  return (
    <Container>
      {Boolean(blogData) && (
        <MyRoom
          selectedCategoryIdx={selectedCategoryIdx}
          onFurnitureClick={handleFurnitureClick}
          roomData={blogData.room}
        />
      )}
      <BoardBox>
        <BoardHeader>
          <CategoryList>
            <CategoryItem
              selected={selectedCategoryIdx === 0 ? 1 : 0}
              onClick={() => handleFurnitureClick(0)}
            >
              전체 게시글
            </CategoryItem>
            <CategoryItem
              selected={selectedCategoryIdx === 1 ? 1 : 0}
              onClick={() => handleFurnitureClick(1)}
            >
              주방가전제품
            </CategoryItem>
            <CategoryItem
              selected={selectedCategoryIdx === 2 ? 1 : 0}
              onClick={() => handleFurnitureClick(2)}
            >
              홈인테리어
            </CategoryItem>
            <CategoryItem
              selected={selectedCategoryIdx === 3 ? 1 : 0}
              onClick={() => handleFurnitureClick(3)}
            >
              실내가구
            </CategoryItem>
            <CategoryItem
              selected={selectedCategoryIdx === 4 ? 1 : 0}
              onClick={() => handleFurnitureClick(4)}
            >
              전자제품
            </CategoryItem>
          </CategoryList>
          {token != null && userInfo.id == id && (
            <WriteButton to={`/${userId}/post/new`}>글쓰기</WriteButton>
          )}
        </BoardHeader>
        <BoardContent>
          {posts.totalCount > 0 ? (
            posts.data.map((post) => (
              <PostPreview key={post.post_id} post={post} />
            ))
          ) : (
            <NoContent>글을 작성해 보세요!</NoContent>
          )}
        </BoardContent>
        <BoardFooter>
          {posts.totalCount > 0 && (
            <MyPagination
              count={Math.ceil(posts.totalCount / 4)}
              page={page}
              onChange={handlePageChange}
            />
          )}
        </BoardFooter>
      </BoardBox>
    </Container>
  );
};

export default MainContent;
