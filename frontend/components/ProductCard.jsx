import React from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import DEFAULT_NO_IMAGE from "../public/assets/default_icon_listing.png";
import { styled } from "@mui/material/styles";

// Styled Card for better visual separation and hover effect
const StyledCard = styled(Card)(({ theme }) => ({
    transition: "box-shadow 0.3s ease-in-out",
    "&:hover": {
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Shadow on hover
    },
    cursor: "pointer",
    maxWidth: 290, // Adjusted maxWidth to fit more cards in a row
    borderRadius: theme.spacing(0.5), // Using theme spacing for consistency
    border: `1px solid ${theme.palette.divider}`, // Adding a subtle border
}));

function ProductCard({ product, toggleModal = () => { } }) {
    const productProfileImage = (media) => {
        if (!media || !media.length) {
            return DEFAULT_NO_IMAGE;
        }
        const profileImg = media.find((m) => m.type === "image");
        return profileImg?.url || DEFAULT_NO_IMAGE;
    };


    console.log({
        product
    });

    return (
        <StyledCard elevation={0} onClick={() => {
            toggleModal(product)
        }}>
            <CardMedia
                sx={{
                    padding: (theme) => theme.spacing(1), // Using theme spacing
                    objectFit: "cover", // Maintain aspect ratio and fill the container
                    height: 200, // Fixed height for consistency
                }}
                component="img"
                image={productProfileImage(product?.media)}
                alt={product?.name}
                onError={(e) => {
                    e.target.src = DEFAULT_NO_IMAGE; // Handle broken images gracefully
                }}
            />
            <CardContent sx={{ borderTop: "1px solid", borderColor: "divider" }}>
                <Typography
                    //   variant="h6"
                    component="div"
                    fontWeight="500"
                    gutterBottom // Add spacing below the title
                >
                    {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Brand: {product?.brand?.name || "N/A"} {/* Handle missing data */}
                </Typography>
                {/* <Typography variant="body2" color="text.secondary">
          Category: {product?.category_slug || "N/A"}
        </Typography> */}
                <Box mt={1}>
                    <Typography variant="subtitle2" fontWeight="500">
                        Price:{" "}
                        {product?.price?.selling?.currency_symbol || "₹"}{" "}
                        {product?.price?.selling?.max || "N/A"}
                    </Typography>
                </Box>
            </CardContent>
        </StyledCard>
    );
}

export default ProductCard;
