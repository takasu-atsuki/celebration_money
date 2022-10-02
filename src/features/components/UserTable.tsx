import React, { FC, memo } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';
import { UserTableProps, getUsers } from '../../type/typesInterface';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import { CategoryPriceTable } from './CategoryPriceTable';

export const UserTable: FC<UserTableProps> = memo((props) => {
  const {
    hundleGetUserPresent,
    expanded,
    handleChange,
    users,
    loading,
    selectUserDetail,
    setSelectUserDetail,
  } = props;

  return (
    <>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: '20px' }} align="right">
                SENDER DETAIL
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user: getUsers) => {
              return (
                <TableRow hover role="checkbox" key={user.name} tabIndex={-1}>
                  <TableCell sx={{ padding: '0' }}>
                    <Accordion
                      expanded={expanded === `${user.id}`}
                      onChange={handleChange(user.id)}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        onClick={() => hundleGetUserPresent(user.id)}
                        id="panel1bh-header"
                        sx={{
                          justifyContent: 'center',
                        }}
                      >
                        <Grid container>
                          <Grid item xs={1}>
                            <Typography>
                              <PersonIcon />
                            </Typography>
                          </Grid>
                          <Grid item xs={11}>
                            <Typography>{user.name}</Typography>
                          </Grid>
                        </Grid>
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{ textAlign: 'center', padding: '0' }}
                      >
                        {selectUserDetail.length !== 0 ? (
                          loading ? (
                            <CircularProgress />
                          ) : (
                            <CategoryPriceTable
                              selectUserDetail={selectUserDetail}
                              setSelectUserDetail={setSelectUserDetail}
                              hundleGetUserPresent={hundleGetUserPresent}
                            />
                          )
                        ) : null}
                      </AccordionDetails>
                    </Accordion>
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
