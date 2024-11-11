import React from 'react';
import SearchRecipes from './Recipes/SearchRecipes';

const Home = () => {
    return (
        <div class="container">
            <h1>Welcome to Recipe Lookup</h1>
            <SearchRecipes />
        </div>
    );
};

export default Home;
