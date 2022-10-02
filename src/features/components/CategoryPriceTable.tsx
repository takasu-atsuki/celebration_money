import React, { FC, memo, useState } from 'react';
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Checkbox,
  TableHead,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CategoryPriceProps } from '../../type/typesInterface';
import { UserSender } from '../../type/typesInterface';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { db } from '../../firebase';
import { doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { UpdateModal } from './UpdateModal';

export const CategoryPriceTable: FC<CategoryPriceProps> = memo((props) => {
  const { selectUserDetail, setSelectUserDetail, hundleGetUserPresent } = props;
  const [editPresent, setEditPresent] = useState<UserSender>({
    id: '',
    user: '',
    categoryId: '',
    category: '',
    price: 0,
    returned: false,
  });
  const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);

  const onClickCheck = async (presentId: string, index: number) => {
    const selectPresent = doc(db, 'presents', presentId);
    const result = await getDoc(selectPresent);
    if (result) {
      await updateDoc(selectPresent, {
        returned: result.data() && !result.data()?.returned,
      });
      const copySelectUserDetail = [...selectUserDetail];
      copySelectUserDetail[index].returned =
        result.data() && !result.data()?.returned;
      setSelectUserDetail([...copySelectUserDetail]);
    }
  };

  const onClickDelete = async (presentId: string, userId: string) => {
    if (window.confirm('本当に削除してもいいですか？')) {
      const selectPresentCollection = doc(db, 'presents', presentId);
      await deleteDoc(selectPresentCollection);
      hundleGetUserPresent(userId);
    }
  };

  const onClickOpen = (user: UserSender) => {
    setEditPresent(user);
    setUpdateModalOpen(true);
  };

  const onClickClose = () => {
    setEditPresent({
      id: '',
      user: '',
      categoryId: '',
      category: '',
      price: 0,
      returned: false,
    });
    setUpdateModalOpen(false);
  };

  return (
    <>
      <UpdateModal
        open={updateModalOpen}
        onClickClose={onClickClose}
        editPresent={editPresent}
        setEditPresent={setEditPresent}
        setSelectUserDetail={setSelectUserDetail}
        hundleGetUserPresent={hundleGetUserPresent}
      />
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>CATEGORY</TableCell>
              <TableCell>PRICE</TableCell>
              <TableCell>RETURNED</TableCell>
              <TableCell>OPTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectUserDetail.map((user: UserSender, index: number) => {
              return (
                <TableRow hover role="checkbox" key={user.id} tabIndex={-1}>
                  <TableCell>{user.category}</TableCell>
                  <TableCell>{user.price}</TableCell>
                  <TableCell onClick={() => onClickCheck(user.id, index)}>
                    <Checkbox
                      icon={<InsertEmoticonIcon />}
                      checkedIcon={<EmojiEmotionsIcon />}
                      checked={user.returned}
                      size="small"
                    ></Checkbox>
                  </TableCell>
                  <TableCell
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <IconButton onClick={() => onClickOpen(user)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => onClickDelete(user.id, user.user)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
});
