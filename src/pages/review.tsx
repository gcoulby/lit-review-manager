import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../services/db";
import { IReview } from "../interfaces";
import ArticleTable from "../components/artcle-table";

function Review(props: any) {
  const params = useParams();
  const foundReview: IReview = useLiveQuery(async () => {
    if (!params.id) return undefined;
    const review = await db.reviews.where("id").equals(params.id).first();
    return review;
  }, [params.id]) as IReview;

  const setArticleInclude = async (articleId: string, include: boolean) => {
    if (!articleId) return;
    foundReview.articles = foundReview.articles.map((article) => {
      if (article.id === articleId) {
        article.include = include;
      }
      return article;
    });
    await db.reviews.put(foundReview);
  };

  const setArticleGptResponse = async (articleId: string, gpt_response: string) => {
    console.log("gpt_response", gpt_response);
    if (!articleId) return;
    foundReview.articles = foundReview.articles.map((article) => {
      if (article.id === articleId) {
        article.gpt_response = gpt_response;
      }
      return article;
    });
    await db.reviews.put(foundReview);
  };

  const deleteArticle = async (articleId: string) => {
    if (!articleId) return;
    foundReview.articles = foundReview.articles.filter((article) => article.id !== articleId);
    await db.reviews.put(foundReview);
  };

  return (
    <>
      {foundReview === undefined ? (
        <p>
          <em>Fetching Review</em>
        </p>
      ) : (
        <>
          <h1>Review of: {foundReview?.title}</h1>
          <p>
            <strong>GPT Prompt:</strong> {foundReview?.gpt_prompt}
          </p>
          <ArticleTable
            articles={foundReview?.articles}
            setArticleInclude={setArticleInclude}
            setGptResponse={setArticleGptResponse}
            deleteArticle={deleteArticle}
          />
        </>
      )}
    </>
  );
}

export default Review;