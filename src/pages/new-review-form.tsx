import React, { ChangeEvent, DragEvent, useEffect, useState, useContext } from "react";
import { IArticle, IContext, IReview } from "../interfaces";
import { v4 } from "uuid";

import { VscNewFile, VscSave } from "react-icons/vsc";
import { useParams } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../services/db";
import ArticleTable from "../components/artcle-table";
import { AppContext } from "../App";
import { Severity } from "../enums";
function NewReviewForm() {
  const params = useParams();
  const context = useContext<IContext>(AppContext);
  const [articles, setArticles] = useState<IArticle[]>([]);

  const [alertLevel, setAlertLevel] = useState<string>("secondary");
  const [loadedStatus, setLoadedStatus] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("Drag a file into the box below to begin");
  const [reviewTitle, setReviewTitle] = useState<string>("");
  const [gptPrompt, setGptPrompt] = useState("");
  // const [headerIndices, setHeaderIndices] = useState([]);

  const foundReview: IReview = useLiveQuery(async () => {
    if (!params.id) return undefined;
    const review = await db.reviews.where("id").equals(params.id).first();
    return review;
  }, [params.id]) as IReview;

  useEffect(() => {
    if (params.id && foundReview !== undefined) {
      setReviewTitle(foundReview.title);
      setGptPrompt(foundReview.gpt_prompt);
      setArticles(foundReview.articles);
    }
  }, [foundReview, params.assessmentId]);

  async function saveReview() {
    try {
      let id = params.id ?? v4();
      const review: IReview = {
        id: id,
        title: reviewTitle,
        gpt_prompt: gptPrompt,
        articles: articles,
      };
      await db.reviews.put(review);
      // if (foundReview) {
      // } else {
      //   await db.reviews.add(review);
      // }
      context.addToast(`Successfully ${params.id ? "updated" : "added"} review entitled: ${reviewTitle}`, Severity.Success);
    } catch (err) {
      context.addToast(`Error adding review: ${err}`, Severity.Error);
    }
  }

  const readFile = (file: File) => {
    var reader: FileReader = new FileReader();
    reader.onload = function (e: ProgressEvent<FileReader>) {
      var contents = e.target?.result;
      if (typeof contents !== "string") return;
      setStatus(`Parsing data from ${file.name}`);
      setAlertLevel("info");
      setLoadedStatus(true);
      contents = contents.replace(/\r/g, "");
      const rows = contents.split("\n");

      const newArticles: IArticle[] = [...articles];
      let headerIndices: { [key: string]: number } = {};
      rows.map((row: string, index: number) => {
        if (index === 0) {
          const headers = row.split('","');
          headers.map((header, index) => {
            headerIndices[header.replace('"', "").trim()] = index;
          });
          return;
        }
        console.log(headerIndices);
        const rowSplit: string[] = row.split('","');
        let authors = rowSplit[headerIndices["Authors"]].split(";").map((author) => {
          return author.trim().replace('"', "");
        });
        let author_short = authors.length > 1 ? authors[0].split(" ")[0] + " et al." : authors[0];
        if (newArticles.find((article) => article.title === rowSplit[headerIndices["Title"]])) return;
        newArticles.push({
          id: v4(),
          include: true,
          authors: authors,
          author_short: author_short,
          title: rowSplit[headerIndices["Title"]],
          year: parseInt(rowSplit[headerIndices["Year"]]),
          doi: rowSplit[headerIndices["DOI"]],
          link: rowSplit[headerIndices["Link"]],
          abstract: rowSplit[headerIndices["Abstract"]],
          gpt_response: "",
        });
      });
      setArticles(newArticles);
    };
    reader.readAsText(file);
  };

  const deleteArticle = async (articleId: string) => {
    if (!foundReview) return;
    foundReview.articles = foundReview.articles.filter((article) => article.id !== articleId);
    await db.reviews.put(foundReview);
  };

  const handleOnDrop = (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    var files: FileList = e.dataTransfer.files;
    readFile(files[0]);
    setLoadedStatus(true);
    setStatus(`Parsing data from ${files[0]?.name}`);
    setAlertLevel("info");
  };

  const handleOnDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  return (
    <>
      <div className="container">
        <form
          className="form-group"
          onSubmit={(event) => {
            event.preventDefault();
            saveReview();
          }}
        >
          <div className="row">
            <div className="col">
              <h1 className="mb-4">
                Create New Review
                <span>
                  <button type="submit" className="btn btn-primary ms-5">
                    {params.id ? (
                      <>
                        <VscSave /> Save
                      </>
                    ) : (
                      <>
                        <VscNewFile /> Create
                      </>
                    )}
                  </button>
                </span>
              </h1>

              <label htmlFor="review_title" className="sr-only">
                <strong>Review Title</strong>
              </label>
              <input
                name="review_title"
                type="text"
                className="form-control mb-4"
                required
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
              />

              <label htmlFor="gpt_prompt" className="sr-only">
                <strong>GPT Prompt</strong>
              </label>
              <textarea name="gpt_prompt" className="form-control mb-4" required value={gptPrompt} onChange={(e) => setGptPrompt(e.target.value)} />
              <h3>Articles</h3>
              <p>
                <em>Add articles to your review from a scopus export</em>
              </p>
              <p className={`alert text-center alert-${alertLevel}`} id="file_name">
                <strong>{loadedStatus ? "" : "No "}File Loaded</strong> {status}
              </p>
              {loadedStatus ? (
                <></>
              ) : (
                <div id="drop_zone" onDragOver={(e) => handleOnDragOver(e)} onDrop={(e) => handleOnDrop(e)}>
                  <p>DROP CSV FILE&nbsp;HERE</p>
                </div>
              )}
            </div>
          </div>
          <ArticleTable articles={articles} deleteArticle={deleteArticle} />
          <span>
            <button type="submit" className="btn btn-primary">
              {params.id ? (
                <>
                  <VscSave /> Save
                </>
              ) : (
                <>
                  <VscNewFile /> Create
                </>
              )}
            </button>
          </span>
        </form>
      </div>
    </>
  );
}

export default NewReviewForm;
