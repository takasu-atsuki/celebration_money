import React, { FC, useState, memo } from 'react';
import {
  CreateUserCategoryProps,
  addCategoryUserErr,
} from '../../type/typesInterface';
import {
  Modal,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import styles from './CreateUserModal.module.css';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import {
  requiredCategoryUserName,
  duplicationName,
} from '../../validation/validation';

export const CreateUserModal: FC<CreateUserCategoryProps> = memo((props) => {
  const [name, setName] = useState<string>('');
  const { open, setOpen, getUserCategory } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<addCategoryUserErr>({
    message: '',
  });

  const onClickClose = () => {
    setOpen();
    setName('');
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
    setName(event.target.value);
  };

  const onClickUserRegister = async () => {
    setLoading(true);
    const errMessage = {
      message: '',
    };

    requiredCategoryUserName(name, errMessage);

    if (errMessage.message.length !== 0) {
      setErr(errMessage);
    }

    await duplicationName(name, 'users', errMessage, '名前');

    if (errMessage.message.length !== 0) {
      setErr(errMessage);
    }

    if (errMessage.message === '') {
      const userCollection = collection(db, 'users');
      await addDoc(userCollection, {
        name: name,
      }).catch((err) => {
        throw new Error(err.message);
      });
      setName('');
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
            CREATE USER
          </Typography>
          <Grid container columnSpacing={2} className={styles.form}>
            <Grid item xs={4}>
              <label htmlFor="sendName">NAME:</label>
            </Grid>
            <Grid item xs={8}>
              <TextField
                label="New Sender Name"
                required
                error={err.message.length !== 0 ? true : false}
                type="text"
                name="sendName"
                id="sendName"
                value={name}
                onChange={onChangeInput}
                fullWidth={true}
                helperText={
                  err.message.length !== 0
                    ? err.message
                    : 'Register New Sender Name'
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
                onClick={onClickUserRegister}
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
});
