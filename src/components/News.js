import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'

const News = (props) => {
    const [articles, setArticles] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalResults, settotalResults] = useState(0);

    const capitalizeFirstLetter = (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }


    const fetchMoreData = async () => {
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page + 1}&pageSize=${props.pageSize}`;
        setPage(page + 1);
        let data = await fetch(url);
        let parsedData = await data.json();
        parsedData.articles = parsedData.articles.filter((article) => { return article.imageUrl !== "" && article.imageUrl !== null && article.title !== null && article.description !== null && article.url !== null && article.publishedAt !== null })
        setArticles(articles.concat(parsedData.articles));
        setisLoading(parsedData.totalResults);

    };

    const updateNews = async () => {
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
        setisLoading(true);
        let data = await fetch(url);
        let parsedData = await data.json();
        parsedData.articles = parsedData.articles.filter((article) => { return article.imageUrl !== "" && article.imageUrl !== null && article.title !== null && article.description !== null && article.url !== null && article.publishedAt !== null })
        setArticles(parsedData.articles);
        settotalResults(parsedData.totalResults);
        setisLoading(false);
    }

    useEffect(() => {
        document.title = `NewsMonkey - ${capitalizeFirstLetter(props.category)}`;
        updateNews();
    }, [])

    return (
        <>
            <div className="container my-3">
                <h1 className='text-center' style={{ margin: '35px 0px', marginTop: '90px' }} >NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
                {isLoading && <Spinner />}
                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length < totalResults}
                    loader={<Spinner />}
                >
                    <div className="container">
                        <div className="row">
                            {articles.map((article, index) => {
                                return <div key={index} className="col-md-4">
                                    <NewsItem title={article.title.slice(0, 45)} description={article.description.slice(0, 88)} imageUrl={article.urlToImage} newsUrl={article.url} author={article.author} date={article.publishedAt} source={article.source.name} />
                                </div>
                            })}
                        </div>
                    </div>
                </InfiniteScroll>
            </div>
        </>
    )
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
}

export default News