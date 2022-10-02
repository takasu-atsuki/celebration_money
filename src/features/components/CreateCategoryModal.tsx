import React, { FC, useState, memo } from 'react';
import {
  Modal,
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import {
  addCategoryUserErr,
  CreateUserCategoryProps,
} from '../../type/typesInterface';
import styles from './CreateUserModal.module.css';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import {
  requiredCategoryUserName,
  duplicationName,
} from '../../validation/validation';

export const CreateCategoryModal: FC<CreateUserCategoryProps> = memo(
  (props) => {
    const { open, setOpen, getUserCategory } = props;
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [err, setErr] = useState<addCategoryUserErr>({
      message: '',
    });

    const onClickClose = () => {
      setOpen();
      setCategory('');
      setErr({ message: '' });
    };

    const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      setErr({ message: '' });
      const errMessage = {
        message: '',
      };
      requiredCategoryUserName(event.target.value, errMessage);

      if (errMessage.message.length !== 0) {
        setErr(errMessage);
      }

      setCategory(event.target.value);
    };

    const onClickCategoryRegister = async () => {
      setLoading(true);
      const errMessage = {
        message: '',
      };
      requiredCategoryUserName(category, errMessage);

      if (errMessage.message.length !== 0) {
        setErr(errMessage);
      }

      await duplicationName(category, 'categories', errMessage, 'カテゴリー名');

      if (errMessage.message.length !== 0) {
        setErr(errMessage);
      }

      if (errMessage.message.length === 0) {
        const categoryCollection = collection(db, 'categories');
        await addDoc(categoryCollection, {
          name: category,
        }).catch((err) => {
          throw new Error(err.message);
        });
        setCategory('');
        setOpen();
        getUserCategory();
      }
      setLoading(false);
    };

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
              CREATE CATEGORY
            </Typography>
            <Grid container columnSpacing={2} className={styles.form}>
              <Grid item xs={4}>
                <label htmlFor="sendName">NAME:</label>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  label="New Category Name"
                  required
                  error={err.message.length !== 0 ? true : false}
                  type="text"
                  name="sendName"
                  id="sendName"
                  value={category}
                  onChange={onChangeInput}
                  fullWidth={true}
                  helperText={
                    err.message.length !== 0
                      ? err.message
                      : 'Register New Category Name'
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ marginTop: '20px' }}
                className={styles.form__buttoncontainer}
              >
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={onClickCategoryRegister}
                  disabled={loading || err.message ? true : false}
                >
                  {loading ? <CircularProgress /> : '登録'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </>
    );
  }
);
