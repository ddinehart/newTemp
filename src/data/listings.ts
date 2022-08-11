import __experiencesListing from "./jsons/__experiencesListing.json";
import {
  DEMO_EXPERIENCES_CATEGORIES,
} from "./taxonomies";
import { ExperiencesDataType } from "./types";
import { DEMO_AUTHORS } from "./authors";


function getExperiences(url: string): Promise<ExperiencesDataType> {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}

const data = getExperiences('http://localhost:5001/experience') || [];

const DEMO_EXPERIENCES_LISTINGS = data.map(
  (post, index): ExperiencesDataType => {
    //  ##########  GET CATEGORY BY CAT ID ######## //
    const category = DEMO_EXPERIENCES_CATEGORIES.filter(
      (taxonomy) => taxonomy.id === post.listingCategoryId
    )[0];

    return {
      ...post,
      id: `experiencesListing_${index}_`,
      saleOff: !index ? "-20% today" : post.saleOff,
      isAds: !index ? true : post.isAds,
      author: DEMO_AUTHORS.filter((user) => user.id === post.authorId)[0],
      listingCategory: category,
    };
  }
);

// const REAL_EXPERIENC = 


export {DEMO_EXPERIENCES_LISTINGS };
