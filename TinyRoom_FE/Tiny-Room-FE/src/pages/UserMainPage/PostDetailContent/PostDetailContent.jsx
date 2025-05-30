import { useCallback, useEffect, useMemo, useState } from "react";
import CommentBox from "./CommentBox";
import NewCommentBox from "./NewCommentBox";
import MainButton from "../../../components/MainButton/MainButton";
import RoundedButton from "../../../components/RoundedButton/RoundedButton";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import {
  BackButton,
  Container,
  Header,
  PaginationBox,
  PostContent,
  PostControlBox,
  PostDate,
  PostDateBox,
  PostFooter,
  PostHeader,
  PostHeaderDivLine,
  PostInfoBox,
  PostTitle,
  PostUpdatedAt,
  PostWeekday,
} from "./PostDetailContent.style";
import Viewer from "../../../components/MyEditor/Viewer";
import MyPagination from "../../../components/Pagination/MyPagination";

const PostDetailContent = () => {
  const location = useLocation();
  const userId = location.pathname.split("/")[1];
  const postId = location.pathname.split("/")[3];

  const navigate = useNavigate();

  const [postData, setPostData] = useState(null);
  const [hasHeart, setHeart] = useState(false);
  const { comment, heartCount, post } = useMemo(() => {
    if (postData === null) return {};
    else {
      return postData;
    }
  }, [postData]);
  const [comments, setComments] = useState({
    totalCount: 0,
    comments: [],
  });
  const [commentsPage, setCommentsPage] = useState(1);

  const getPostData = useCallback(async () => {
    const response = await axios.get(
      `http://127.0.0.1:8080/posts/postDetail?post_id=${postId}`
    );

    setPostData(response.data);
  }, [postId]);

  const getComments = useCallback(async () => {
    const response = await axios.get(
      `http://localhost:8080/comments/view?post_id=${postId}&page=${
        commentsPage - 1
      }`
    );

    setComments(response.data);
  }, [commentsPage, postId]);

  const checkHeart = useCallback(async () => {
    const response = await axios.get(
      `http://localhost:8080/hearts/view?post_id=${postId}`,
      {
        headers: { auth_token: localStorage.getItem("token") },
      }
    );

    setHeart(response.data === 1);
  }, [postId]);

  const addHeart = useCallback(async () => {
    const response = await axios.get(
      `http://localhost:8080/hearts/add?post_id=${postId}`,
      {
        headers: { auth_token: localStorage.getItem("token") },
      }
    );

    if (response.data.result === "success") {
      getPostData();
      checkHeart();
    }
  }, [postId]);

  const deleteHeart = useCallback(async () => {
    const response = await axios.delete(
      `http://localhost:8080/hearts/delete?post_id=${postId}`,
      {
        headers: { auth_token: localStorage.getItem("token") },
      }
    );

    if (response.data.result === "success") {
      getPostData();
      checkHeart();
    }
  }, [postId]);

  useEffect(() => {
    getPostData();

    if (localStorage.getItem("token") !== null) {
      checkHeart();
    }
  }, [location.pathname, getPostData, checkHeart]);

  useEffect(() => {
    getComments();
  }, [commentsPage]);

  const handleHeartClick = useCallback(() => {
    if (hasHeart) {
      deleteHeart();
    } else {
      addHeart();
    }
  }, [hasHeart, addHeart, deleteHeart]);

  const handleCommentsPageChange = useCallback((e, val) => {
    setCommentsPage(val);
  }, []);

  const handleUpdateClick = useCallback(() => {
    navigate(`/${userId}/post/update/${postId}`);
  }, [userId, postId]);

  const handleDeleteClick = useCallback(async () => {
    const canDelete = confirm("포스트를 삭제하시겠습니까?");

    if (canDelete) {
      const response = await axios.put(
        `http://localhost:8080/posts/delete?post_id=${postId}`,
        undefined,
        { headers: { auth_token: localStorage.getItem("token") } }
      );

      if (response.data.result === "success") navigate(`/${userId}`);
    }
  }, [userId, postId]);

  const handleGoToBack = useCallback(() => {
    navigate(`/${userId}`);
  }, [userId, postId]);

  return (
    <Container>
      <Header>
        <BackButton onClick={() => handleGoToBack()}>
          <img src="/images/arrow_back.svg" alt="BackButton" />
        </BackButton>
        {post?.category.category_name}
      </Header>
      <PostHeader>
        <PostDateBox>
          <PostDate>{post ? dayjs(post.date).format("M.D") : ""}</PostDate>
          <PostWeekday>
            {post ? dayjs(post.date).format("ddd") : ""}
          </PostWeekday>
        </PostDateBox>
        <PostHeaderDivLine />
        <PostTitle>{post?.title}</PostTitle>
      </PostHeader>
      <PostContent>
        <PostUpdatedAt>{post?.w_date} 최근 작성</PostUpdatedAt>
        <Viewer value={post?.content} />
      </PostContent>
      <PostFooter>
        <PostInfoBox>
          <RoundedButton
            icon={hasHeart ? "heart.svg" : `heart_empty.svg`}
            onClick={handleHeartClick}
          >
            좋아요 {heartCount}
          </RoundedButton>
          <RoundedButton disabled icon="chat.svg">
            댓글 {comment?.length}
          </RoundedButton>
        </PostInfoBox>
        <PostControlBox>
          <MainButton onClick={handleUpdateClick}>수정</MainButton>
          <MainButton onClick={handleDeleteClick}>삭제</MainButton>
        </PostControlBox>
      </PostFooter>
      <CommentBox comments={comments} getComments={getComments} />
      <PaginationBox>
        <MyPagination
          count={Math.ceil(comments.totalCount / 10)}
          page={commentsPage}
          onChange={handleCommentsPageChange}
        />
      </PaginationBox>
      <NewCommentBox getComments={getComments} />
    </Container>
  );
};

export default PostDetailContent;
