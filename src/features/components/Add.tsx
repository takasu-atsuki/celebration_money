import React, { FC, useEffect, useState, memo } from 'react';
import {
  CardContent,
  Grid,
  TextField,
  Card,
  Typography,
  Fab,
  Button,
  CircularProgress,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddIcon from '@mui/icons-material/Add';
import styles from './Add.module.css';
import { CreateUserModal } from './CreateUserModal';
import { CreateCategoryModal } from './CreateCategoryModal';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  getUsers,
  getCategories,
  addPresentErr,
} from '../../type/typesInterface';
import { Loading } from './Loading';
import {
  requiredText,
  priceLow,
  priceRegExp,
} from '../../validation/validation';

export const Add: FC = memo(() => {
  const [loading, setLoading] = useState<boolean>(false);
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [userModal, setUserModal] = useState<boolean>(false);
  const [categoryModal, setCategoryModal] = useState<boolean>(false);
  const [users, setUsers] = useState<getUsers[] | null>([]);
  const [categories, setCategories] = useState<getCategories[] | null>([]);
  const [err, setErr] = useState<addPresentErr>({
    user: '',
    category: '',
    price: '',
  });

  const getUserCategory = async (): Promise<void> => {
    //
    // firebaseの全ユーザと全カテゴリーを取得してstateに格納する関数
    //

    setLoading(true);
    const userCollection = collection(db, 'users');
    const categoryCollection = collection(db, 'categories');
    Promise.all([
      await getDocs(userCollection),
      await getDocs(categoryCollection),
    ])
      .then((result) => {
        const all_user = result[0].docs.map((value, index) => {
          const user = {
            id: value.id,
            name: value.data().name,
          };
          if (index === 0) {
            setUserId(value.id);
          }
          return user;
        });
        setUsers(all_user);
        const all_categories = result[1].docs.map((value, index) => {
          const category = {
            id: value.id,
            name: value.data().name,
          };
          if (index === 0) {
            setCategoryId(value.id);
          }
          return category;
        });
        setCategories(all_categories);
      })
      .catch((err) => {
        throw new Error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    //
    //  このページを開いた時に一度だけ全ユーザーと全カテゴリーを取得する
    //

    getUserCategory();
  }, []);

  const onChangeUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    //
    //ユーザーセレクトを選択した時のstateを更新する関数
    //

    setErr({ ...err, user: '' });

    const errMessage: addPresentErr = {
      user: '',
      category: err.category,
      price: err.price,
    };
    requiredText(event.target.value, 'user', errMessage);
    if (errMessage.user.length !== 0) {
      setErr({ ...err, user: errMessage.user });
    }
    setUserId(event.target.value);
  };

  const onChangeCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    //
    //カテゴリーセレクトを選択した時のstateを更新する関数
    //

    setErr({ ...err, category: '' });

    const errMessage: addPresentErr = {
      user: err.user,
      category: '',
      price: err.price,
    };
    requiredText(event.target.value, 'category', errMessage);
    if (errMessage.category.length !== 0) {
      setErr({ ...err, category: errMessage.category });
    }
    setCategoryId(event.target.value);
  };

  const onChangePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    //
    //プライスのインプットを更新した時のstateを更新する関数
    //

    setErr({ ...err, price: '' });

    const errMessage: addPresentErr = {
      user: err.user,
      category: err.category,
      price: '',
    };
    requiredText(Number(event.target.value), 'price', errMessage);
    if (errMessage.price.length !== 0) {
      setErr({ ...err, ...errMessage });
    }
    priceLow(Number(event.target.value), 'price', 0, errMessage);
    if (errMessage.price.length !== 0) {
      setErr({ ...err, ...errMessage });
    }
    priceRegExp(Number(event.target.value), 'price', errMessage);
    if (errMessage.price.length !== 0) {
      setErr({ ...err, ...errMessage });
    }

    setPrice(Number(event.target.value));
  };

  const onClickRegisterSendPresent = async () => {
    //
    // 登録ボタンが押されたときfirebaseのpresentsテーブルに登録したいpresentの情報を登録する処理
    // バリデーション
    // 送り主の欄とカテゴリー名の欄とプライス欄が空で送信された時
    // プライスが0以下の時
    // プライスが文字列で送信された時
    //

    setRegisterLoading(true);

    setErr({ user: '', category: '', price: '' });
    const errMessage = { user: '', category: '', price: '' };
    requiredText(userId, 'user', errMessage);
    requiredText(categoryId, 'category', errMessage);
    requiredText(price, 'price', errMessage);

    if (errMessage.user || errMessage.category || errMessage.price) {
      setErr({
        ...errMessage,
      });
      setRegisterLoading(false);
      return;
    }

    priceLow(price, 'price', 0, errMessage);

    if (errMessage.price) {
      setErr({
        ...err,
        ...errMessage,
      });
      setRegisterLoading(false);
      return;
    }

    priceRegExp(price, 'price', errMessage);

    if (errMessage.price) {
      setErr({
        ...err,
        ...errMessage,
      });
      setRegisterLoading(false);
      return;
    }

    const presentCollection = collection(db, 'presents');

    await addDoc(presentCollection, {
      user: userId,
      category: categoryId,
      price: price,
      returned: false,
    })
      .catch((err) => {
        throw new Error(err);
      })
      .finally(() => {
        setPrice(0);
        setRegisterLoading(false);
      });
  };

  const onClickOpenUserModal = () => {
    //
    // ユーザー登録のモーダルを開く関数
    //

    setUserModal(true);
  };

  const onClickOpenCategoryModal = () => {
    //
    // カテゴリー登録のモーダルを開く関数
    //

    setCategoryModal(true);
  };

  const userModalClose = () => {
    //
    // ユーザー登録のモーダルを閉じる関数
    //

    setUserModal(false);
  };

  const categoryModalClose = () => {
    //
    // カテゴリー登録のモーダルを閉じる関数
    //

    setCategoryModal(false);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <CreateUserModal
            open={userModal}
            setOpen={userModalClose}
            getUserCategory={getUserCategory}
          />
          <CreateCategoryModal
            open={categoryModal}
            setOpen={categoryModalClose}
            getUserCategory={getUserCategory}
          />
          <Card className={styles.card} raised={true}>
            <CardContent>
              <Grid container spacing={2} className={styles.card__content}>
                <Grid item xs={3}>
                  <Typography variant="subtitle2">SENDER: </Typography>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    select
                    error={err.user.length !== 0 ? true : false}
                    name="senderName"
                    value={
                      users?.length !== 0 && users !== null && userId === ''
                        ? users[0].id
                        : userId
                    }
                    required
                    onChange={onChangeUser}
                    InputLabelProps={{ shrink: true }}
                    SelectProps={{ native: true }}
                    label="Sender Name"
                    size="medium"
                    sx={{ minWidth: '200px' }}
                    helperText={err.user.length !== 0 ? err.user : null}
                  >
                    {users?.map((user) => {
                      return (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      );
                    })}
                  </TextField>
                </Grid>
                <Grid item xs={2}>
                  <Fab onClick={onClickOpenUserModal}>
                    <PersonAddIcon />
                  </Fab>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="subtitle2">CATEGORY: </Typography>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    select
                    error={err.category.length !== 0 ? true : false}
                    name="category"
                    value={
                      categories?.length !== 0 &&
                      categories !== null &&
                      categoryId === ''
                        ? categories[0].id
                        : categoryId
                    }
                    onChange={onChangeCategory}
                    helperText={err.category.length !== 0 ? err.category : null}
                    SelectProps={{ native: true }}
                    required
                    label="Category Name"
                    size="medium"
                    sx={{ minWidth: '200px' }}
                    InputLabelProps={{ shrink: true }}
                  >
                    {categories?.map((category) => {
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      );
                    })}
                  </TextField>
                </Grid>
                <Grid item xs={2}>
                  <Fab onClick={onClickOpenCategoryModal}>
                    <AddIcon />
                  </Fab>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="subtitle2">PRICE:</Typography>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    type="number"
                    error={err.price.length !== 0 ? true : false}
                    inputProps={{ min: 0 }}
                    value={price === 0 ? '' : price}
                    required
                    onChange={onChangePrice}
                    helperText={err.price.length !== 0 ? err.price : null}
                    label="Present Price"
                    size="medium"
                    sx={{ minWidth: '200px' }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <div></div>
                </Grid>
                <Grid item xs={12} sx={{ marginTop: '20px' }}>
                  <Button
                    onClick={onClickRegisterSendPresent}
                    variant="contained"
                    color="secondary"
                    disabled={
                      registerLoading || err.user || err.category || err.price
                        ? true
                        : false
                    }
                  >
                    {registerLoading ? <CircularProgress /> : ' 登録'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
});
