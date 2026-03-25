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
    categoryId: 0,
    publisherId: 0,
    authorId: 0,
    shortDescription: "",
    details: "",
    status: 1,
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

  // Loader for AsyncSelect
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

  // Load data for edit
  useEffect(() => {
    if (id) {

      BookService.GetById(Number(id))
        .then((resp: any) => {
          const data = resp.data;
          setBookData({ ...data, pdfFile: null, coverPhoto: null });
          setSelectedAuthor({ value: data.authorId, label: data.author });
          setSelectedCategory({ value: data.categoryId, label: data.category });
          setSelectedPublisher({ value: data.publisherId, label: data.publisher });

          loadOptions(data.author, AuthorService, "authors").then(resp => {
            setDefaultAuthors(resp);
          });

          loadOptions(data.publisher, PublisherService, "publishers").then(resp => {
            setDefaultPublishers(resp);
          });

          loadOptions(data.category, CategoryService, "categories").then(resp => {
            setDefaultCategories(resp);
          });

        })
        .catch(() => alert("Failed to load book"));
    }
    else {
      loadOptions("", AuthorService, "authors").then(resp => {
        setDefaultAuthors(resp);
      });

      loadOptions("", PublisherService, "publishers").then(resp => {
        setDefaultPublishers(resp);
      });

      loadOptions("", CategoryService, "categories").then(resp => {
        setDefaultCategories(resp);
      });
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

      {/* ✅ Back Button at Top-Left */}
      <div className="mb-3">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/Books")}
        >
          ← Back
        </button>
      </div>

      <div className="card p-4 shadow-sm" style={{ maxWidth: "800px", margin: "auto" }}>
        <h3 className="text-center mb-4">{id ? "Edit Book" : "Add Book"}</h3>

        <form onSubmit={saveBook}>
          {/* Title */}
          <input name="title" className="form-control mb-3" placeholder="Title" value={bookData.title} onChange={handleInput} required />

          {/* Price */}
          <input name="price" type="text" className="form-control mb-3" placeholder="Price" value={bookData.price} onChange={handleInput} required />

          {/* Author */}
          <AsyncSelect
            cacheOptions
            defaultOptions={defaultAuthors}
            loadOptions={(input) => loadOptions(input, AuthorService, "authors")}
            onChange={(option: any) => {
              setSelectedAuthor(option);
              setBookData({ ...bookData, authorId: option?.value });
            }}
            value={selectedAuthor}
            placeholder="Select Author"
            className="mb-3"
          />

          {/* Category */}
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

          {/* Short Description */}
          <textarea name="shortDescription" className="form-control mb-3" placeholder="Short Description" value={bookData.shortDescription} onChange={handleInput} />

          {/* Details */}
          <textarea name="details" className="form-control mb-3" placeholder="Details" value={bookData.details} onChange={handleInput} />

          {/* Cover Photo */}
          <div className="mb-3">
            <label>Cover Photo</label>
            <input type="file" className="form-control" onChange={handleCover} accept=".jpg,.jpeg,.png,.gif" />
          </div>
          {(bookData.coverPhoto || bookData.coverPhotoUrl) && (
            <div className="mb-3">
              <img
                src={bookData.coverPhoto ? URL.createObjectURL(bookData.coverPhoto) : AppConstants.FileServerUrl + bookData.coverPhotoUrl}
                alt="Cover Preview"
                style={{ width: 150, height: 200, objectFit: "cover" }}
              />
            </div>
          )}

          {/* PDF */}
          <div className="mb-3">
            <label>Upload PDF</label>
            <input type="file" className="form-control" onChange={handlePdf} accept=".pdf" />
          </div>

          {/* Images */}
          <div className="mb-3">
            <label>Upload Images</label>
            <input type="file" multiple className="form-control" onChange={handleImages} accept=".jpg,.jpeg,.png,.gif" />
          </div>

          {/* Preview Images */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            {bookData.bookAttachments.map((img: any, i: number) => (
              <div key={i} style={{ position: "relative" }}>
                <img
                  src={img.file ? URL.createObjectURL(img.file) : AppConstants.FileServerUrl + img.fileUrl}
                  width={80}
                  height={80}
                  style={{ objectFit: "cover" }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  style={{ position: "absolute", top: 0, right: 0, background: "red", color: "#fff", border: "none" }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="mb-3">
            <input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} className="form-control" placeholder="Add feature" />
            <button type="button" className="btn btn-sm btn-secondary mt-2" onClick={addFeature}>Add Feature</button>
          </div>

          {/* Feature List */}
          <ul className="list-group mb-3">
            {bookData.features.map((f: string, i: number) => (
              <li key={i} className="list-group-item d-flex justify-content-between">
                {f}
                <button onClick={() => removeFeature(i)} className="btn btn-sm btn-danger">Remove</button>
              </li>
            ))}
          </ul>

          <div className="text-center">
            <button className="btn btn-primary px-5">{id ? "Update" : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};