import { Dispatch, SetStateAction } from 'react';

export interface UserSender {
  // userが送信したデータを使いやすくした型定義
  id: string;
  user: string;
  categoryId: string | undefined;
  category: string | undefined;
  price: number;
  returned: boolean | undefined;
}
export interface UserTableProps {
  //UserTable.tsxでpropsに渡される型定義
  hundleGetUserPresent(userId: string): Promise<void>;
  expanded: string | false;
  handleChange(
    panel: string
  ): (event: React.SyntheticEvent, isExpanded: boolean) => void;
  users: getUsers[];
  loading: boolean;
  selectUserDetail: UserSender[] | [];
  setSelectUserDetail: Dispatch<SetStateAction<[] | UserSender[]>>;
}
export interface CategoryPriceProps {
  //CategoryPriceTable.tsxでpropsに渡される型定義
  selectUserDetail: UserSender[];
  setSelectUserDetail: Dispatch<SetStateAction<[] | UserSender[]>>;
  hundleGetUserPresent(userId: string): Promise<void>;
}
export interface CreateUserCategoryProps {
  //CreateCategoryModal.tsxとCreateUserModal.tsxのpropsに渡される型定義
  open: boolean;
  setOpen(): void;
  getUserCategory(): Promise<void>;
}
export interface getUsers {
  //firebaseから送り主を取得して使いやすくした型定義
  id: string;
  name: string;
}
export interface getCategories {
  //firebaseからカテゴリーを取得して使いやすくした型定義
  id: string;
  name: string;
}
export interface UpdateProps {
  //presentsテーブルを更新するUpdateModal.tsxに渡されるpropsの型定義
  open: boolean;
  onClickClose(): void;
  editPresent: {
    id: string;
    user: string;
    categoryId: string | undefined;
    category: string | undefined;
    price: number;
    returned: boolean | undefined;
  };
  setEditPresent: Dispatch<SetStateAction<UserSender>>;
  setSelectUserDetail: Dispatch<SetStateAction<UserSender[] | []>>;
  hundleGetUserPresent(userId: string): Promise<void>;
}
export interface addPresentErr {
  //presentsテーブルを更新する際のエラーの変数の型定義
  user: string;
  category: string;
  price: string;
}
export interface addCategoryUserErr {
  //カテゴリーと送り主を追加する時のエラーの変数の型定義
  message: string;
}
