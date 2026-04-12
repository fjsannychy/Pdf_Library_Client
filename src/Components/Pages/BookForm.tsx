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
    // ★ UPDATE: Added discount fields to state
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
    <div className="container mt-5">
      <div className="mb-3">
        <button type="button" className="btn btn-secondary" onClick={() => navigate("/Books")}>
          ← Back
        </button>
      </div>

      <div className="card p-4 shadow-sm" style={{ maxWidth: "800px", margin: "auto" }}>
        <h3 className="text-center mb-4">{id ? "Edit Book" : "Add Book"}</h3>

        <form onSubmit={saveBook}>
          {/* Title */}
          <div className="mb-3">
            <label className="form-label fw-bold">Book Title</label>
            <input name="title" className="form-control" placeholder="Enter book title" value={bookData.title} onChange={handleInput} required />
          </div>

          {/* ★ UPDATE: Added Discount and Price Section */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label fw-bold">Current Price</label>
              <input name="price" type="number" className="form-control" placeholder="Price" value={bookData.price} onChange={handleInput} required />
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

          {/* Author */}
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
            placeholder="Search and Select Author"
            className="mb-3"
          />

          {/* Category */}
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
            placeholder="Select Category"
            className="mb-3"
          />

          {/* Publisher */}
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
            placeholder="Select Publisher"
            className="mb-3"
          />

          {/* Descriptions */}
          <div className="mb-3">
            <label className="form-label fw-bold">Short Description</label>
            <textarea name="shortDescription" className="form-control" placeholder="Brief summary" value={bookData.shortDescription} onChange={handleInput} />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Full Details</label>
            <textarea name="details" className="form-control" rows={4} placeholder="Detailed description" value={bookData.details} onChange={handleInput} />
          </div>

          {/* Files */}
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

          {/* Cover Preview */}
          {(bookData.coverPhoto || bookData.coverPhotoUrl) && (
            <div className="mb-3 text-center">
              <img
                src={bookData.coverPhoto ? URL.createObjectURL(bookData.coverPhoto) : AppConstants.FileServerUrl + bookData.coverPhotoUrl}
                alt="Cover Preview"
                className="img-thumbnail"
                style={{ width: 120, height: 160, objectFit: "cover" }}
              />
            </div>
          )}

          {/* Additional Images */}
          <div className="mb-3">
            <label className="form-label fw-bold">Gallery Images</label>
            <input type="file" multiple className="form-control" onChange={handleImages} accept=".jpg,.jpeg,.png,.gif" />
          </div>

          <div className="d-flex flex-wrap gap-2 mb-3">
            {bookData.bookAttachments.map((img: any, i: number) => (
              <div key={i} className="position-relative border p-1 rounded">
                <img
                  src={img.file ? URL.createObjectURL(img.file) : AppConstants.FileServerUrl + img.fileUrl}
                  width={60} height={60} style={{ objectFit: "cover" }}
                />
                <button type="button" onClick={() => removeImage(i)} className="btn btn-danger btn-sm position-absolute top-0 end-0 py-0 px-1" style={{ fontSize: '10px' }}>×</button>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="mb-3">
            <label className="form-label fw-bold">Features</label>
            <div className="input-group">
              <input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} className="form-control" placeholder="Add book feature" />
              <button type="button" className="btn btn-outline-secondary" onClick={addFeature}>Add</button>
            </div>
            <div className="mt-2">
              {bookData.features.map((f: string, i: number) => (
                <span key={i} className="badge bg-light text-dark border me-1 p-2">
                  {f} <i className="bi bi-x-circle ms-1 cursor-pointer text-danger" onClick={() => removeFeature(i)}></i>
                </span>
              ))}
            </div>
          </div>

          <label className="form-label fw-bold">Status</label>
          <select name="status" className="form-select mb-4" value={bookData.status} onChange={handleInput}>
            <option value={0}>Active</option>
            <option value={1}>Inactive</option>
          </select>

          <div className="text-center">
            <button className="btn btn-primary btn-lg px-5 shadow">{id ? "Update Book" : "Save Book"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};