package com.example.recipelookup.recipemodels;

import jakarta.persistence.*;

@Entity
public class Recipe {
    @Id
    private Long id;
    @Column(length = 10000)
    private String title;
    private String image;
    @Column(length = 100000)
    private String summary;

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
