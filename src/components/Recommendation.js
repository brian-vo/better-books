import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Typography } from '@mui/material';
import { css } from '@emotion/react';

const Recommendation = ({ sender_id, recommend_num, isSent }) => {
  const [wishlist_items, setWishlistItems] = useState([]);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.black',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    color: 'white ',
  };

  const textStyles = css({
    color: 'black',
  });

  useEffect(() => {
    // Fetch the wishlist_items data from the API
    const fetchWishlistItems = async () => {
      const response = await fetch(`/recommendation/view/${recommend_num}`);
      const data = await response.json();
      setWishlistItems(data.wishlist_items);
    };
    fetchWishlistItems();
  }, [recommend_num]);

  return (
    <div className="recommendation">
      <Button onClick={handleOpen}>#{recommend_num}</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Recommendation #{recommend_num}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <p>Recommendations:</p>
            <ul className={textStyles}>
              {wishlist_items.map((item) => {
                return (
                  <li>
                    {item.isbn ? `ISBN: ${item.isbn}` : `Author: #${item.author_ids}`}
                  </li>
                );
              })}
            </ul>
          </Typography>
        </Box>
      </Modal>
      <div className="sender">
        {isSent ? 'To: User #' : 'From: User #'}
        {sender_id}
      </div>
    </div>
  );
};

export default Recommendation;
