import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookService } from "../../Services/bookService";
import { AppConstants } from "../../AppConstants";
import {
  PdfLoader,
  PdfHighlighter,

  type ScaledPosition,
} from "react-pdf-highlighter";
import { GlobalWorkerOptions, version as pdfjsVersion } from "pdfjs-dist";
import { UserMarkService } from "../../Services/userMarkService";
import type { UserMarkModel } from "../../Models/UserMarkModel";

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

export const ReadBook: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<any>(null);
  const loaded = useRef<boolean>(false);

  const [highlights, setHighlights] = useState<any[]>([]);

  const lastSelection = useRef<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const deleteMark = (id: number) => {
    if (confirm("Remove this highlight?")) {
      UserMarkService.Delete(id).then((resp: any) => {
          setHighlights(prev =>
            prev.filter(h => h.id !== id)
          );
      });
    }
  };

  useEffect(() => {
    if (id && !loaded.current) {
      loaded.current = true;
      BookService.GetById(Number(id), true)
        .then((resp: any) => {

          setBook(resp.data)

          wait(1000).then((wt: any) => {

            UserMarkService.GetList(Number(id))
              .then((resp: any) => {

                const data = resp.data.map((r: UserMarkModel) => {

                  return {
                    id: r.id,
                    bookId: r.bookId,
                    position: {
                      pageNumber: r.pageNumber,
                      boundingRect: {
                        x1: r.positionTopX,
                        y1: r.positionTopY,
                        x2: r.positionBottomX,
                        y2: r.positionBottomY,
                        width: r.positionBottomX - r.positionTopX,
                        height: r.positionBottomY - r.positionTopY,
                        pageNumber: r.pageNumber
                      },
                      rects: []
                    },
                    content: { text: "" },
                  }

                });

                setHighlights(data);

              })
              .catch(() => alert("Failed to load highlights"));

          });

          BookService.AddUserAction({ bookId: Number(id), actionType: 1});


        }

        )
        .catch(() => alert("Failed to load book"));

    }
  }, [id]);

  const renderPrice = () => {
    if (!book) return null;
    if (book.price === 0) return <span className="badge bg-success">Free</span>;
    if (book.discountPercent && book.discountPercent > 0) {
      const discountedPrice = book.price - book.discountPercent;
      return (
        <>
          <span className="text-decoration-line-through me-2">
            {book.price} {AppConstants.Currency}
          </span>
          <span className="text-danger">
            {discountedPrice} {AppConstants.Currency}
          </span>
        </>
      );
    }
    return (
      <span>
        {book.price} {AppConstants.Currency}
      </span>
    );
  };

  if (!book) return <p className="text-center mt-5">Loading...</p>;

  return (
    <>
      <div className="container mt-4" id="upper-container">
        <button
          className="btn btn-secondary mb-3"
          onClick={() => navigate("/book-details/" + book.id)}
        >
          ← Back
        </button>

        <div className="card p-4 shadow d-flex flex-row gap-4">
          {book.coverPhotoUrl && (
            <img
              src={AppConstants.FileServerUrl + book.coverPhotoUrl}
              alt={book.title}
              style={{ width: "300px", height: "200px", objectFit: "cover" }}
              className="mb-3"
            />
          )}
          <div>
            <h2>{book.title}</h2>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Publisher:</strong> {book.publisher}</p>
            <p><strong>Category:</strong> {book.category}</p>
            <p><strong>Price:</strong> {renderPrice()}</p>
          </div>
        </div>
      </div>
      <div className="container mt-4">
        <div
          ref={containerRef}
          style={{
            position: "relative",
            width: "100%",
            height: "80vh",
            marginTop: "20px",
          }}
        >
          {book.pdfUrl && (
            <PdfLoader url={AppConstants.FileServerUrl + book.pdfUrl} beforeLoad={<p>Loading PDF...</p>}>
              {(pdfDocument: any) => (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <PdfHighlighter
                    pdfDocument={pdfDocument}
                    highlights={highlights}
                    enableAreaSelection={() => true}
                    onSelectionFinished={(
                      position: ScaledPosition,
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      content,
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      hideTipAndSelection,
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      transformSelection
                    ): JSX.Element | null => {

                      if (lastSelection.current === JSON.stringify(position)) return null;
                      lastSelection.current = JSON.stringify(position);

                      if (confirm("Are you sure you want to mark it?")) {

                        UserMarkService.Create({
                          id: 0,
                          bookId: book.id,
                          userId: 0,
                          pageNumber: position.boundingRect.pageNumber ?? 0,
                          positionTopY: position.boundingRect.y1 ?? 0,
                          positionTopX: position.boundingRect.x1 ?? 0,
                          positionBottomY: position.boundingRect.y2,
                          positionBottomX: position.boundingRect.x2 ?? 0,
                        } as UserMarkModel).then(resp => {

                          setHighlights(prev => [
                            ...prev,
                            {
                              id: resp.data,
                              bookId: book.bookId,
                              position: {
                                pageNumber: position.boundingRect.pageNumber,
                                boundingRect: {
                                  x1: position.boundingRect.x1,
                                  y1: position.boundingRect.y1,
                                  x2: position.boundingRect.x2,
                                  y2: position.boundingRect.y2,
                                  width: position.boundingRect.x2 - position.boundingRect.x1,
                                  height: position.boundingRect.y2 - position.boundingRect.y1,
                                  pageNumber: position.boundingRect.pageNumber
                                },
                                rects: []
                              },
                              content: { text: "" },
                            }
                          ]);

                        })

                      }

                      return null;
                    }}
                    scrollRef={() => containerRef.current}
                    onScrollChange={() => { }}
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    highlightTransform={(_h, _i, _setTip, _hideTip) => {

                      const rect = highlights.find(x => x.id === _h.id).position.boundingRect;


                      // Convert rect coordinates to CSS percentages
                      const style: any = {
                        position: "absolute",
                        left: `${rect.x1}px`,
                        top: `${rect.y1}px`,
                        width: `${rect.width}px`,
                        height: `${rect.height}px`,
                        backgroundColor: "rgba(155, 155, 155, 0.3)", // semi-transparent highlight
                        pointerEvents: "auto", 
                        zIndex: 10,
                      };



                      return <div key={_h.id} style={style} onClick={() => { deleteMark(_h.id) }}  ></div>;

                    }}
                  />
                </div>
              )}
            </PdfLoader>
          )}
        </div>
      </div>
    </>
  );
};