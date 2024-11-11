import React from 'react';
import SavedRecipes from './SavedRecipes';

const Profile = () => {
  return (
    <div class="container">
      <h1>Profile</h1>
      
      <section>
        <h2>Saved Recipes</h2>
        <SavedRecipes />
      </section>
    </div>
  );
};

export default Profile;
