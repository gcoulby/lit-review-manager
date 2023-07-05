import { useContext, useState, useEffect } from "react";
import { FaExternalLinkAlt, FaRegEye, FaTrash } from "react-icons/fa";
import { BsPencilSquare, BsFillQuestionOctagonFill } from "react-icons/bs";
import { BiAtom } from "react-icons/bi";
import { IArticle } from "../interfaces";
import { AppContext } from "../App";
function ArticleTable({
  articles,
  setArticleInclude,
  setGptResponse,
  setComments,
  deleteArticle,
}: {
  articles: IArticle[];
  setArticleInclude?: any;
  setGptResponse?: any;
  setComments?: any;
  deleteArticle?: any;
}) {
  const context = useContext(AppContext);
  const [deleteId, setDeleteId] = useState<string>("");

  useEffect(() => {
    if (deleteId !== "") {
      setTimeout(() => {
        setDeleteId("");
      }, 2000);
    }
  }, [deleteId]);
  return (
    <>
      <div className="row mt-4">
        <div className="col">
          <table className="table table-striped">
            <thead>
              <tr>
                {setArticleInclude && <th scope="col">Include</th>}
                <th scope="col">Author</th>
                <th scope="col">Title</th>
                <th scope="col">year</th>
                <th scope="col">DOI</th>
                <th scope="col">Scopus</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles?.map((article, i) => (
                <tr key={`review-article-${i}`}>
                  {setArticleInclude && (
                    <td>
                      <div className={`col-sm-10"}`}>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`flexSwitchCheckDefault`}
                            checked={article.include}
                            onChange={(e) => setArticleInclude(article.id, e.target.checked)}
                          />
                        </div>
                      </div>
                    </td>
                  )}
                  <td>{article.author_short}</td>
                  <td>{article.title}</td>
                  <td>{article.year}</td>
                  <td>
                    {article.doi ? (
                      <a href={`https://doi.org/${article.doi}`} rel="noopener noreferrer" target="_blank">
                        <FaExternalLinkAlt />
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    <a href={article.link} rel="noopener noreferrer" target="_blank">
                      <FaExternalLinkAlt />
                    </a>
                  </td>
                  <td width={"330px"}>
                    <button
                      className="btn btn-sm btn-outline-dark"
                      onClick={() => {
                        context.setModalContent({
                          title: "Abstract",
                          articleId: article.id,
                          content: article.abstract,
                          onSave: () => {},
                          editable: false,
                        });
                        context.setShowModal(true);
                      }}
                    >
                      <FaRegEye /> Abstract
                    </button>
                    <button
                      className={`btn btn-sm btn${article.gpt_response === "" ? "-outline" : ""}-dark ms-2`}
                      onClick={() => {
                        context.setModalContent({
                          title: "GPT",
                          articleId: article.id,
                          content: article.gpt_response,
                          onSave: setGptResponse,
                          editable: true,
                        });
                        context.setShowModal(true);
                      }}
                    >
                      <BiAtom /> GPT
                    </button>
                    <button
                      className={`btn btn-sm btn${article.comments === "" || article.comments === undefined ? "-outline" : ""}-dark ms-2`}
                      onClick={() => {
                        context.setModalContent({
                          title: "Comments",
                          articleId: article.id,
                          content: article.comments ?? "",
                          onSave: setComments,
                          editable: true,
                        });
                        context.setShowModal(true);
                      }}
                    >
                      <BsPencilSquare /> Comments
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger ms-2"
                      onClick={() => {
                        if (deleteId !== article.id) {
                          setDeleteId(article.id);
                        } else {
                          deleteArticle(article.id);
                        }
                      }}
                    >
                      {deleteId !== article.id ? <FaTrash /> : <BsFillQuestionOctagonFill />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default ArticleTable;
