import { Link } from "react-router-dom";
import { db } from "../services/db";
import { useLiveQuery } from "dexie-react-hooks";
import { FaTrash, FaPlus, FaPencilAlt } from "react-icons/fa";
import { BsFillQuestionOctagonFill } from "react-icons/bs";
import { useEffect, useState } from "react";

function ReviewList(props: any) {
  const [deleteId, setDeleteId] = useState<string>("");

  useEffect(() => {
    if (deleteId !== "") {
      setTimeout(() => {
        setDeleteId("");
      }, 2000);
    }
  }, [deleteId]);

  const reviews = useLiveQuery(async () => {
    const reviews = await db.reviews.toArray();
    return reviews;
  }, []);

  const deleteReview = async (id: string) => {
    if (!id) return;
    await db.reviews.delete(id);
  };

  return (
    <>
      <h1>Reviews</h1>

      <Link to="/reviews/new" className="btn btn-dark">
        <FaPlus /> Add Review
      </Link>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Article Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews?.map((review) => (
            <tr key={review.id}>
              <td>
                <Link to={`/reviews/${review.id}`}>{review.title}</Link>
              </td>
              <td>{review.articles.length}</td>
              <td>
                <Link className="btn btn-sm btn-warning" to={`/reviews/${review.id}/edit`}>
                  <FaPencilAlt />
                </Link>
                <button
                  type="button"
                  className="btn btn-sm btn-danger ms-2"
                  onClick={() => {
                    if (deleteId !== review.id) {
                      setDeleteId(review.id);
                    } else {
                      deleteReview(review.id);
                    }
                  }}
                >
                  {deleteId !== review.id ? <FaTrash /> : <BsFillQuestionOctagonFill />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default ReviewList;
