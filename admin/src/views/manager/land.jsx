import { useQuery } from '@apollo/client';
import { Divider, Grid, Typography, Tabs, Tab, Box, TextField, MenuItem, Button } from '@mui/material';
import CreateRSPost from 'components/create';
import PostDetail from 'components/post';
import RSList from 'components/rsList';
import UpdateRSPost from 'components/update-post';
import { GET_LAND_POSTS } from 'graphql/queries/land';
import SearchSection from 'layout/MainLayout/Header/SearchSection';
import { useCallback, useEffect, useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';

const Land = () => {
    const [filter, setFilter] = useState({
        category: "MuaBan"
    })
    const [paging, setPaging] = useState({
        cursor: 0,
        limit: 20
    })
    const [items, setItems] = useState([])
    const [canShowMore, setCanShowMore] = useState(true)
    const [selectedPost, setSelectedPost] = useState(null)

    const [menu, setMenu] = useState(0)

    const { data, error, refetch } = useQuery(GET_LAND_POSTS, {
        variables: {
            filter
        },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'no-cache'
    })

    useEffect(() => {
        if (data) {
            if (items.length !== data?.lands.length) {
                setCanShowMore(true)
            }

            setItems(data.lands)
        }
    }, [data, error])

    const onSearch = useCallback((title) => {
        refetch({
            filter,
            paging,
            search: title
        })
    }, [filter, paging, refetch])
    
    const onGoBack = useCallback(() => {
        setSelectedPost(undefined)
        setMenu(0)
        refetch()
    }, [selectedPost, menu])

    const onSelectPost = useCallback((post) => {
        setSelectedPost(post)
        setMenu(2)
    }, [selectedPost, menu])

    const onViewPost = useCallback((post) => {
        setSelectedPost(post)
        setMenu(3)
    }, [selectedPost, menu])

    const renderMenu = () => {
        switch (menu) {
            case 0:
                return <RSList data={items} selectPost={onSelectPost} type="dat" viewPost={onViewPost} />

            case 1:
                return <CreateRSPost type="dat" goBack={onGoBack}/>

            case 2:
                return <UpdateRSPost type="dat" post={selectedPost} goBack={onGoBack}/>

            case 3:
                return <PostDetail post={selectedPost} />

            default:
                return <RSList data={items} selectPost={onSelectPost} type="dat" />
        }
    }

    const showMorePost = () => {
        setCanShowMore(false)
        setPaging(s => ({ ...s, limit: s.limit + 20 }))
        refetch({
            paging: { limit: paging.limit + 20 }
        })
    }

    return (
        <MainCard>
            <Grid container spacing={1}>
                <Grid xl={3} item>
                    <Typography variant="h3" sx={{ display: "flex", alignItems: "center", height: "100%" }}>
                        {menu === 0
                            ? "Danh s??ch b???t ?????ng s???n ?????t ??ai"
                            : "Th??m m???i tin ????ng ?????t ??ai"
                        }
                    </Typography>
                </Grid>
                <Grid xl={6} item>
                    <Box display={"flex"} justifyContent="center">
                        <TextField
                            id="outlined-select-currency"
                            select
                            label="Select"
                            value={filter.category}
                            onChange={e => setFilter(s => ({ ...s, category: e.target.value }))}
                        >
                            <MenuItem value={"MuaBan"}>
                                {"Mua B??n"}
                            </MenuItem>
                            <MenuItem value={"ChoThue"}>
                                {"Cho Thu??"}
                            </MenuItem>
                        </TextField>
                        <SearchSection onSearch={onSearch} />
                    </Box>
                </Grid>
                <Grid xl={3} item>
                    <Box display={"flex"} justifyContent="flex-end">
                        <Tabs value={menu} onChange={(e, value) => setMenu(value)}>
                            <Tab label="Danh s??ch" id={`tab-1`} />
                            <Tab label="Th??m m???i" id={`tab-2`} />
                        </Tabs>
                    </Box>
                </Grid>
            </Grid>
            <Divider sx={{ margin: 2 }} />
            {renderMenu()}
            {menu === 0
                && (
                    <Box display={"flex"} mt={2} justifyContent="center">
                        <Button onClick={() => showMorePost()} disabled={!canShowMore} variant='outlined'> Xem th??m </Button>
                    </Box>
                )
            }
        </MainCard>
    );
}

export default Land