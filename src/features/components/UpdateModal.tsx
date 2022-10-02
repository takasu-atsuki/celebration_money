import React, { FC, useEffect, useState, memo } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  UpdateProps,
  getUsers,
  getCategories,
  UserSender,
  addPresentErr,
} from '../../type/typesInterface';
import styles from './CreateUserModal.module.css';
import { db } from '../../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import {
  priceLow,
  priceRegExp,
  requiredText,
} from '../../validation/validation';

export const UpdateModal: FC<UpdateProps> = memo((props) => {
  const {
    open,
    onClickClose,
    editPresent,
    setEditPresent,
    hundleGetUserPresent,
  } = props;
  const [users, setUsers] = useState<getUsers[] | []>([]);
  const [categories, setCategories] = useState<getCategories[] | []>([]);
  const [err, setErr] = useState<addPresentErr>({
    user: '',
    category: '',
    price: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  //updateのときローディングさせるか？

  const getUser = async () => {
    const userCollection = collection(db, 'users');
    const result = await getDocs(userCollection);
    const getUsers = result.docs.map((value) => {
      const getuser = {
        id: value.id,
        name: value.data().name,
      };
      return getuser;
    });
    setUsers(getUsers);
  };

  const getCategory = async () => {
    const categoryCollection = collection(db, 'categories');
    const result = await getDocs(categoryCollection);
    const getCategories = result.docs.map((value) => {
      const getCategory = {
        id: value.id,
        name: value.data().name,
      };
      return getCategory;
    });
    setCategories(getCategories);
  };

  const onChangeCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErr({ ...err, category: '' });
    const errMessage = {
      user: err.user,
      category: '',
      price: err.price,
    };
    requiredText(event.target.value, 'category', errMessage);
    if (errMessage.category.length !== 0) {
      setErr({ ...err, ...errMessage });
    }
    setEditPresent({ ...editPresent, categoryId: event.target.value });
  };

  const onChangePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErr({ ...err, price: '' });
    const errMessage = {
      user: err.user,
      category: err.category,
      price: '',
    };
    requiredText(Number(event.target.value), 'price', errMessage);
    if (errMessage.price.length !== 0) {
      setErr({ ...err, price: errMessage.price });
    }
    priceLow(Number(event.target.value), 'price', 0, errMessage);
    if (errMessage.price.length !== 0) {
      setErr({ ...err, price: errMessage.price });
    }
    priceRegExp(Number(event.target.value), 'price', errMessage);
    if (errMessage.price.length !== 0) {
      setErr({ ...err, price: errMessage.price });
    }
    setEditPresent({ ...editPresent, price: Number(event.target.value) });
  };

  const onClickUpdatePresent = async (editPresent: UserSender) => {
    setLoading(true);
    const updatePresentCollection = doc(db, 'presents', editPresent.id);
    await updateDoc(updatePresentCollection, {
      user: editPresent.user,
      category: editPresent.categoryId,
      price: editPresent.price,
      returned: editPresent.returned,
    });
    hundleGetUserPresent(editPresent.user);
    onClickClose();
    setLoading(false);
  };

  useEffect(() => {
    getUser();
    getCategory();
  }, []);

  return (
    <>
      <Modal
        open={open}
        onClose={onClickClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.modal}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ marginBottom: '20px' }}
          >
            UPDATE
          </Typography>
          <Grid
            container
            spacing={2}
            alignItems="center"
            sx={{ marginBottom: '20px' }}
          >
            <Grid item xs={4}>
              <label htmlFor="user">NAME :</label>
            </Grid>
            <Grid item xs={8}>
              <p>{users.find((user) => user.id === editPresent.user)?.name}</p>
              {/* <TextField
                // select
                id="user"
                value={users.find((user) => user.id === editPresent.user)?.name}
                // onChange={(event) =>
                //   setEditPresent({ ...editPresent, user: event.target.value })
                // }
                name="user"
                fullWidth={true}
                InputProps={{ readOnly: true }}
                disabled
              >
                {/* {users.map((user) => {
                  return (
                    <MenuItem
                      selected={editPresent.user === user.id}
                      value={user.id}
                      key={user.id}
                    >
                      {user.name}
                    </MenuItem>
                  );
                })} */}
              {/* </TextField>  */}
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            alignItems="center"
            sx={{ marginBottom: '20px' }}
          >
            <Grid item xs={4}>
              <label htmlFor="category">CATEGORY :</label>
            </Grid>
            <Grid item xs={8}>
              <TextField
                select
                id="category"
                value={editPresent.categoryId}
                onChange={onChangeCategory}
                name="category"
                fullWidth={true}
              >
                {categories.map((category) => {
                  return (
                    <MenuItem
                      selected={editPresent.category === category.name}
                      value={category.id}
                      key={category.id}
                    >
                      {category.name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={2}
            alignItems="center"
            sx={{ marginBottom: '20px' }}
          >
            <Grid item xs={4}>
              <label htmlFor="price">PRICE :</label>
            </Grid>
            <Grid item xs={8}>
              <TextField
                error={err.price.length !== 0 ? true : false}
                type="number"
                id="category"
                value={editPresent.price === 0 ? '' : editPresent.price}
                onChange={onChangePrice}
                name="category"
                inputProps={{ min: 0 }}
                helperText={err.price.length !== 0 ? err.price : 'Update Price'}
                fullWidth={true}
              />
            </Grid>
          </Grid>
          <Box textAlign="center">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => onClickUpdatePresent(editPresent)}
              disabled={
                loading || err.user || err.category || err.price ? true : false
              }
            >
              {loading ? <CircularProgress /> : '更新'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
});
