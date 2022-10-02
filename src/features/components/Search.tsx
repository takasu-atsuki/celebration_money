import React, { FC, useEffect, useState, memo } from 'react';
import { Paper, CircularProgress } from '@mui/material';
import styles from './Search.module.css';
import { UserTable } from './UserTable';
import { UserSender } from '../../type/typesInterface';
import { getUsers } from '../../type/typesInterface';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

export const Search: FC = memo(() => {
  const [expanded, setExpanded] = React.useState<string | false>(false); //panelの名前が入る
  const [users, setUsers] = useState<getUsers[]>([]);
  const [selectUserDetail, setSelectUserDetail] = useState<UserSender[] | []>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [userLoading, setUserLoading] = useState<boolean>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  //名前を押せば名前の下にテーブルを挿入する(再び名前を押すとテーブル収納する(スライド))

  useEffect(() => {
    setUserLoading(true);
    (async () => {
      const userCollection = collection(db, 'users');
      const result = await getDocs(userCollection);
      const all_user = result.docs.map((val) => {
        const user = {
          id: val.id,
          name: val.data().name,
        };
        return user;
      });
      setUsers(all_user);
      setUserLoading(false);
    })();
  }, []);

  const getPresent = async () => {
    const presentCollection = collection(db, 'presents');
    const result = await getDocs(presentCollection);
    return result;
  };

  const getCategory = async () => {
    const categoryCollection = collection(db, 'categories');
    const result = await getDocs(categoryCollection);
    return result;
  };

  const hundleGetUserPresent = async (userId: string) => {
    setLoading(true);
    const allPresentQuery = await getPresent();
    const allCategoryQuery = await getCategory();
    const allUserPresent = allPresentQuery.docs.filter((val) => {
      return val.data().user === userId;
    });
    const allPresentDetail = allUserPresent.map((value) => {
      const category = allCategoryQuery.docs.find((category) => {
        return category.id === value.data().category;
      });
      const presentDetail = {
        id: value.id,
        user: value.data().user,
        categoryId: category?.id,
        category: category?.data().name,
        price: value.data().price,
        returned: value.data().returned,
      };
      return presentDetail;
    });
    setSelectUserDetail(allPresentDetail);
    setLoading(false);
  };

  return (
    <>
      <div>
        {userLoading ? (
          <CircularProgress />
        ) : (
          <Paper
            elevation={3}
            sx={{ maxWidth: '800px' }}
            className={styles.container}
          >
            <UserTable
              hundleGetUserPresent={hundleGetUserPresent}
              expanded={expanded}
              handleChange={handleChange}
              users={users}
              loading={loading}
              selectUserDetail={selectUserDetail}
              setSelectUserDetail={setSelectUserDetail}
            />
          </Paper>
        )}
      </div>
    </>
  );
});
