import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import urljoin from "url-join";
import "./style/ProductListing.css";
import { useParams } from "react-router-dom";
import greenDot from "../public/assets/green-dot.svg";
import grayDot from "../public/assets/grey-dot.svg";
import DEFAULT_NO_IMAGE from "../public/assets/default_icon_listing.png";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import urlJoin from "url-join";
import ProductCard from "./ProductCard";

const EXAMPLE_MAIN_URL = window.location.origin;

const ProductListing = ({ handleSubmit = () => {} }) => {
  const [pageLoading, setPageLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { application_id, company_id } = useParams();

  useEffect(() => {
    !!application_id ? fetchApplicationProducts() : fetchProducts();
  }, [application_id]);

  const fetchProducts = async () => {
    setPageLoading(true);
    try {
      const { data } = await axios.get(
        urljoin(EXAMPLE_MAIN_URL, "/api/products"),
        {
          headers: {
            "x-company-id": company_id,
          },
        }
      );
      setProductList(data.items);
    } catch (e) {
      console.error("Error fetching products:", e);
    } finally {
      setPageLoading(false);
    }
  };

  const fetchApplicationProducts = async () => {
    setPageLoading(true);
    try {
      const { data } = await axios.get(
        urlJoin(
          EXAMPLE_MAIN_URL,
          `/api/products/application/${application_id}`
        ),
        {
          headers: {
            "x-company-id": company_id,
          },
        }
      );

      setProductList(data.items);
    } catch (e) {
      console.error("Error fetching application products:", e);
    } finally {
      setPageLoading(false);
    }
  };

  const productProfileImage = (media) => {
    if (!media || !media.length) {
      return DEFAULT_NO_IMAGE;
    }
    const profileImg = media.find((m) => m.type === "image");
    return profileImg?.url || DEFAULT_NO_IMAGE;
  };

  const toggleModal = (product) => {
    setShowModal(!showModal);
    setSelectedProduct(product);
  };

  const handleselectImage = (selectedImage) => {
    setSelectedImage(selectedImage);
  };

  const storeAndmoveToNextStep = () => {
    handleSubmit({
      selectedProduct,
      selectedImage,
    });
  };

  const filteredProducts = useMemo(() => {
    if (!searchText) return productList;
    return productList.filter((product) =>
      product?.name?.toLowerCase().includes(searchText?.toLowerCase())
    );
  }, [searchText, productList]);

  return (
    <div className="landing-page">
      {pageLoading ? (
        <div className="loader-container">
          <CircularProgress />
        </div>
      ) : (
        <div className="content-card">
          <div className="sales-channel-title">Products</div>
          <p className="sales-description">
            Here's a list of Products which you can add in your Instagram
          </p>
          {productList?.length > 0 && (
            <>
              <TextField
                label="Search"
                variant="outlined"
                placeholder="Search Sales Channels"
                fullWidth
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
            </>
          )}

          {filteredProducts?.length === 0 ? (
            <div className="no-sales-channel">
              Oppss!! No any Products is available.
            </div>
          ) : (
            <div className="card-container">
              {filteredProducts?.map((product, productIndex) => (
                <ProductCard product={product} toggleModal={toggleModal}/>
              ))}
            </div>
          )}

          <div>
            <Dialog
              open={showModal}
              onClose={toggleModal}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                Select Product Image
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Select Product Image which you want to add in your Instagram
                </DialogContentText>
                <div className="product-images">
                  {selectedProduct?.media?.map((image, index) => (
                    <div
                      index={"product-image-select-image" + index}
                      onClick={() => handleselectImage(image)}
                    >
                      <img
                        className={`product-image-select ${
                          selectedImage?.url === image.url ? "selected" : ""
                        }`}
                        src={image?.url || DEFAULT_NO_IMAGE}
                        alt={selectedProduct.name + "image"}
                      />
                    </div>
                  ))}
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    toggleModal();
                    setSelectedImage(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={storeAndmoveToNextStep}
                  autoFocus
                  disabled={!selectedImage}
                >
                  Select
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListing;
