import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export const requiredText = (
  //
  // テーブルpresentsに新しく要素を追加する時の入力必須項目のエラー検知のバリデーション
  //

  text: string | number, //stateを渡す
  key: 'user' | 'category' | 'price', //errのkeyを指定
  err: { user: string; category: string; price: string } //更新したいerrのオブジェクトを入れる
): void => {
  if (
    (typeof text === 'string' && text.length === 0) ||
    (typeof text === 'number' && text === 0)
  ) {
    err[key] = '入力必須項目です';
  }
  return;
};

export const priceLow = (
  //
  // テーブルpresentsに新しく要素を追加する時のpriceが引数minを下回ってないかの関数
  //

  number: number, //priceのstate
  key: 'price', //errのkey
  min: number, //下限の数字
  err: { user: string; category: string; price: string } //更新したいerrのオブジェクト
): void => {
  if (number < min) {
    err[key] = `${min}以下は入力できません`;
  }
  return;
};

export const priceRegExp = (
  //
  // テーブルpresentsに新しく要素を追加する時のpriceが数字で送信されているか確認の関数
  //

  text: number, //priceのstate
  key: 'price', //errのkey
  err: { user: string; category: string; price: string } //更新したいerrのオブジェクト
): void => {
  const regexp = new RegExp(/^[-]?\d+$/g);
  if (!regexp.test(String(text))) {
    err[key] = '数字を入力してください';
  }
  return;
};

export const requiredCategoryUserName = (
  //
  // テーブルcategoriesとusersを更新する時に入力必須項目のエラー検知の関数
  //

  name: string, //category, userのstate
  err: { message: string } //更新したいerrのオブジェクト
): void => {
  if (name.length === 0) {
    err.message = '入力必須項目が入力されていません';
  }
  return;
};

export const duplicationName = async (
  //
  // テーブルcategories, usersを更新する時に人の名前とカテゴリー名に重複がないかの確認関数
  //

  name: string, //category, nameのstate
  table: string, //検索テーブル
  err: { message: string }, //更新するerrのオブジェクト
  helpErrMessage: string //重複しているのは何かを代入
): Promise<void> => {
  const tableCollections = collection(db, table);
  const tableAllContents = await getDocs(tableCollections);
  const result = tableAllContents.docs.find((content) => {
    return content.data().name === name;
  });
  if (result?.id) {
    err.message = `重複している${helpErrMessage}が存在します`;
  }
  return;
};
