import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { BookService } from "../../Services/bookService";
import { AuthorService } from "../../Services/authorService";
import { CategoryService } from "../../Services/categoryService";
import { PublisherService } from "../../Services/publisherService";
import { AppConstants } from "../../AppConstants";

export const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bookData, setBookData] = useState<any>({
    id: 0,
    title: "",
    price: null,
    discountPercent: 0,
    priceBeforeDiscount: null,
    categoryId: 0,
    publisherId: 0,
    authorId: 0,
    shortDescription: "",
    details: "",
    status: 0,
    features: [],
    bookAttachments: [],
    pdfFile: null,
    coverPhoto: null,
    coverPhotoUrl: ""
  });

  const [featureInput, setFeatureInput] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedPublisher, setSelectedPublisher] = useState<any>(null);

  const [defaultAuthors, setDefaultAuthors] = useState<any[]>([]);
  const [defaultPublishers, setDefaultPublishers] = useState<any[]>([]);
  const [defaultCategories, setDefaultCategories] = useState<any[]>([]);

  const loadOptions = async (inputValue: string, service: any, type: string) => {
    try {
      const payload = { search: inputValue, pageNumber: 1, pageSize: 20 };
      const resp = await service.GetList(payload);
      const data = resp.data[type] || [];
      return data.map((d: any) => ({ value: d.id, label: d.name }));
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  useEffect(() => {
    if (id) {
      BookService.GetById(Number(id), false)
        .then((resp: any) => {
          const data = resp.data;
          setBookData({ ...data, pdfFile: null, coverPhoto: null });
          setSelectedAuthor({ value: data.authorId, label: data.author });
          setSelectedCategory({ value: data.categoryId, label: data.category });
          setSelectedPublisher({ value: data.publisherId, label: data.publisher });

          loadOptions(data.author, AuthorService, "authors").then(resp => setDefaultAuthors(resp));
          loadOptions(data.publisher, PublisherService, "publishers").then(resp => setDefaultPublishers(resp));
          loadOptions(data.category, CategoryService, "categories").then(resp => setDefaultCategories(resp));
        })
        .catch(() => alert("Failed to load book"));
    } else {
      loadOptions("", AuthorService, "authors").then(resp => setDefaultAuthors(resp));
      loadOptions("", PublisherService, "publishers").then(resp => setDefaultPublishers(resp));
      loadOptions("", CategoryService, "categories").then(resp => setDefaultCategories(resp));
    }
  }, [id]);

  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  const handlePdf = (e: any) => setBookData({ ...bookData, pdfFile: e.target.files[0] });
  const handleCover = (e: any) => setBookData({ ...bookData, coverPhoto: e.target.files[0] });

  const handleImages = (e: any) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file: any) => ({ id: 0, file }));
    setBookData({ ...bookData, bookAttachments: [...bookData.bookAttachments, ...newImages] });
  };

  const removeImage = (index: number) => {
    const updated = [...bookData.bookAttachments];
    updated.splice(index, 1);
    setBookData({ ...bookData, bookAttachments: updated });
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setBookData({ ...bookData, features: [...bookData.features, featureInput] });
    setFeatureInput("");
  };

  const removeFeature = (index: number) => {
    const updated = [...bookData.features];
    updated.splice(index, 1);
    setBookData({ ...bookData, features: updated });
  };

  const saveBook = (e: any) => {
    e.preventDefault();
    const request = id
      ? BookService.Update(Number(id), bookData)
      : BookService.Create(bookData);

    request
      .then(() => {
        alert(`Book ${id ? "updated" : "created"} successfully!`);
        navigate("/Books");
      })
      .catch((err: any) => {
        console.error(err);
        alert("Failed to save");
      });
  };

  return (
    <div className="book-form-page" style={{ 
        minHeight: "100vh", 
        background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)", // Light Yellow/Amber Background
        padding: "40px 15px"
    }}>
      {/* Yellow Theme Styles */}
      <style>{`
        .custom-card {
            background: #ffffff;
            border: 5px solid #1e293b;
            /* Blue and Black mixed gradient border */
            border-image: linear-gradient(45deg, #2563eb, #000000, #3b82f6) 1;
            box-shadow: 0 15px 35px rgba(180, 83, 9, 0.15);
        }
        .form-label { color: #1e293b; letter-spacing: 0.5px; }
        .form-control, .form-select { 
            border: 1px solid #d1d5db !important;
            background-color: #fafaf9;
        }
        .form-control:focus { 
            background-color: #ffffff;
            border-color: #2563eb !important; 
            box-shadow: 0 0 0 0.2rem rgba(37, 99, 235, 0.1); 
        }
        .btn-primary { 
            background: linear-gradient(45deg, #1e293b, #2563eb); 
            border: none;
            transition: all 0.3s ease;
        }
        .btn-primary:hover {
            background: linear-gradient(45deg, #000000, #1d4ed8);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        .feature-badge {
            background-color: #fefce8;
            color: #92400e;
            border: 1px solid #fde68a;
        }
      `}</style>

      <div className="container">
        <div className="mb-4">
          <button type="button" className="btn btn-dark shadow-sm" onClick={() => navigate("/Books")}>
            ← Back to Books
          </button>
        </div>

        <div className="card p-4 custom-card" style={{ maxWidth: "850px", margin: "auto", borderRadius: "0px" }}>
          <h3 className="text-center mb-4 fw-bold" style={{ color: "#000", borderBottom: "3px solid #fbbe24b8", display: "inline-block", width: "100%", paddingBottom: "10px" }}>
            {id ? "EDIT BOOK DETAILS" : "ADD NEW BOOK"}
          </h3>

          <form onSubmit={saveBook}>
            <div className="mb-3">
              <label className="form-label fw-bold">Book Title</label>
              <input name="title" className="form-control" placeholder="Enter book title" value={bookData.title} onChange={handleInput} required />
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label fw-bold">Current Price</label>
                <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 border-dark">$</span>
                    <input name="price" type="number" className="form-control border-start-0" placeholder="Price" value={bookData.price} onChange={handleInput} required />
                </div>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">Discount %</label>
                <input name="discountPercent" type="number" className="form-control" placeholder="e.g. 10" value={bookData.discountPercent} onChange={handleInput} />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">Original Price</label>
                <input name="priceBeforeDiscount" type="number" className="form-control" placeholder="Before Discount" value={bookData.priceBeforeDiscount} onChange={handleInput} />
              </div>
            </div>

            <div className="row">
                <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Author</label>
                    <AsyncSelect
                        cacheOptions
                        defaultOptions={defaultAuthors}
                        loadOptions={(input) => loadOptions(input, AuthorService, "authors")}
                        onChange={(option: any) => {
                            setSelectedAuthor(option);
                            setBookData({ ...bookData, authorId: option?.value });
                        }}
                        value={selectedAuthor}
                    />
                </div>
                <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Category</label>
                    <AsyncSelect
                        cacheOptions
                        defaultOptions={defaultCategories}
                        loadOptions={(input) => loadOptions(input, CategoryService, "categories")}
                        onChange={(option: any) => {
                            setSelectedCategory(option);
                            setBookData({ ...bookData, categoryId: option?.value });
                        }}
                        value={selectedCategory}
                    />
                </div>
                <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Publisher</label>
                    <AsyncSelect
                        cacheOptions
                        defaultOptions={defaultPublishers}
                        loadOptions={(input) => loadOptions(input, PublisherService, "publishers")}
                        onChange={(option: any) => {
                            setSelectedPublisher(option);
                            setBookData({ ...bookData, publisherId: option?.value });
                        }}
                        value={selectedPublisher}
                    />
                </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Short Description</label>
              <textarea name="shortDescription" className="form-control" placeholder="Brief summary" value={bookData.shortDescription} onChange={handleInput} />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Full Details</label>
              <textarea name="details" className="form-control" rows={3} placeholder="Detailed description" value={bookData.details} onChange={handleInput} />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Cover Photo</label>
                <input type="file" className="form-control" onChange={handleCover} accept=".jpg,.jpeg,.png,.gif" />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Book PDF</label>
                <input required={id ? false : true} type="file" className="form-control" onChange={handlePdf} accept=".pdf" />
              </div>
            </div>

            {(bookData.coverPhoto || bookData.coverPhotoUrl) && (
              <div className="mb-3 text-center">
                <img
                  src={bookData.coverPhoto ? URL.createObjectURL(bookData.coverPhoto) : AppConstants.FileServerUrl + bookData.coverPhotoUrl}
                  alt="Cover Preview"
                  className="img-thumbnail"
                  style={{ width: 110, height: 150, objectFit: "cover", border: "2px solid #2563eb" }}
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label fw-bold">Gallery Images</label>
              <input type="file" multiple className="form-control" onChange={handleImages} accept=".jpg,.jpeg,.png,.gif" />
            </div>

            <div className="d-flex flex-wrap gap-2 mb-3">
              {bookData.bookAttachments.map((img: any, i: number) => (
                <div key={i} className="position-relative border border-primary p-1 rounded bg-white shadow-sm">
                  <img
                    src={img.file ? URL.createObjectURL(img.file) : AppConstants.FileServerUrl + img.fileUrl}
                    width={55} height={55} style={{ objectFit: "cover" }}
                  />
                  <button type="button" onClick={() => removeImage(i)} className="btn btn-danger btn-sm position-absolute top-0 end-0 py-0 px-1" style={{ fontSize: '10px' }}>×</button>
                </div>
              ))}
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Features</label>
              <div className="input-group">
                <input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} className="form-control" placeholder="Add book feature" />
                <button type="button" className="btn btn-outline-dark" onClick={addFeature}>+ Add</button>
              </div>
              <div className="mt-2">
                {bookData.features.map((f: string, i: number) => (
                  <span key={i} className="badge feature-badge me-1 p-2">
                    {f} <i className="bi bi-x-circle ms-1 cursor-pointer text-danger" onClick={() => removeFeature(i)}></i>
                  </span>
                ))}
              </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-6">
                    <label className="form-label fw-bold">Status</label>
                    <select name="status" className="form-select" value={bookData.status} onChange={handleInput}>
                        <option value={0}>Active</option>
                        <option value={1}>Inactive</option>
                    </select>
                </div>
            </div>

            <div className="text-center">
              <button className="btn btn-primary btn-lg px-5 shadow-lg text-uppercase fw-bold">
                {id ? "Update Book" : "Create Book"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};