'use strict';
{
  const optArticleSelector = '.post';
  const optTitleSelector = '.post-title';
  const optTitleListSelector = '.titles';
  const optArticleTagsSelector = '.post-tags .list';
  const optArticleAuthorSelector = '.post-author';
  const optAuthorsListSelector = '.authors';
  const optCloudClassCount = 4;
  const optCloudClassPrefix = 'tag-size-';
  const titleClickHandler = function(event) {
    const clickedElement = this;
    event.preventDefault();
    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');
    for(let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }
    /* add class 'active' to the clicked link */
    clickedElement.classList.add('active');
    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');
    for(let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }
    /* get 'href' attribute from the clicked link */
    const findClickedId = clickedElement.getAttribute('href');
    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(findClickedId);
    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };
  
  function generateTitleLinks(customSelector = '') {
    const titleList = document.querySelector(optTitleListSelector);
    /* remove contents of titleList */
    titleList.innerHTML = '';
    const articles = document.querySelectorAll(optArticleSelector + customSelector);
    let html = '';
    /* for each article */
    for(let article of articles) {
      /* get the article id */
      const articleId = article.getAttribute('id');
      /* get the title from the title element */
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;
      /* create HTML of the link */
      const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
      html = html + linkHTML;
    }
    /* insert link into titleList */
    titleList.innerHTML = html;
    const links = document.querySelectorAll('.titles a');
    for(let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  }
  generateTitleLinks();

  function calculateTagsParams(tags) {
    const params = {
      max: 0,
      min: 9999
    }
    for(let tag in tags) {
      if(tags[tag] > params.max) {
        params.max = tags[tag];
      }
      if(tags[tag] < params.min) {
        params.min = tags[tag];
      }
    }
    return params;
  }
  function calculateTagClass(count, params) {
    const classNumber = Math.floor( ( (count - params.min) / (params.max - params.min) ) * optCloudClassCount + 1 );
    return optCloudClassPrefix + classNumber;
  }

  function generateTags() {
    /* create a new variable allTags with an empty object */
    let allTags = {};
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);
    /* START LOOP: for every article: */
      for(let article of articles) {
      /* find tags wrapper */
      const tagWrap = article.querySelector(optArticleTagsSelector)
      /* make html variable with empty string */
      let tagHTML = '';
      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');
      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      /* START LOOP: for each tag */
        for(let tag of articleTagsArray) {
        /* generate HTML of the link */
        const linkHTML = '<li><a href="#tag-' + tag +'">' + tag + '</a></li>';
        /* add generated code to html variable */
        tagHTML = tagHTML + ' ' + linkHTML;
        /* check if this link is NOT already in allTags */
        if(!allTags.hasOwnProperty(tag)) {
          /* add generated code to allTags array */
          allTags[tag] = 1; 
        }
        else {
          allTags[tag]++;
        }
      /* END LOOP: for each tag */
        }
      /* insert HTML of all the links into the tags wrapper */
      tagWrap.innerHTML = tagHTML;
    /* END LOOP: for every article: */
      }
    /* find list of tags in right column */
    const tagList = document.querySelector('.tags');
  
    /* add html from allTags to tagList */
    const tagsParams = calculateTagsParams(allTags);
    let allTagsHTML = '';
    for(let tag in allTags) {
      const tagLinkHTML = '<a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + '</a> '
      allTagsHTML += tagLinkHTML;
    }
    tagList.innerHTML = allTagsHTML;
  }
  
  generateTags();

  function tagClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    /* find all tag links with class active */
    const tagsActive = document.querySelectorAll('a.active[href^="#tag-"]');
    /* START LOOP: for each active tag link */
    for(let tagActive of tagsActive) {
    /* remove class active */
      tagActive.classList.remove('active');
    /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const tagsEqual = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for(let tagEqual of tagsEqual) {
    /* add class active */
      tagEqual.classList.add('active');
    /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }
  
  function addClickListenersToTags() {
    /* find all links to tags */
    const allLinks = document.querySelectorAll('.post-tags a, .tags a');
    /* START LOOP: for each link */
    for(let allLink of allLinks) {
    /* add tagClickHandler as event listener for that link */
      allLink.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
    }
  }
  
  addClickListenersToTags();

  function generateAuthors() {
    /* DONE find all articles */
    let allAuthors = {};
    const articles = document.querySelectorAll(optArticleSelector); 
    /* DONE START LOOP:  for every article: */
    for(let article of articles) {
      /* find tags wrapper */
      const authorWrap = article.querySelector(optArticleAuthorSelector);
      let authorHTML = '';
      /* get tags from data-tags attribute */
      const authorName = article.getAttribute('data-author');
      /* generate HTML of the link */
      const authorLinkHTML = '<a href="#author-' + authorName +'">' + authorName + '</a>';
      authorHTML = authorHTML + authorLinkHTML
      if(!allAuthors.hasOwnProperty(authorName)) {
        allAuthors[authorName] = 1; 
      }
      else {
        allAuthors[authorName]++;
      }
      /* insert HTML of all the links into the tags wrapper */
      authorWrap.innerHTML = authorHTML;
    /* END LOOP: for every article: */
    }
    const authorList = document.querySelector(optAuthorsListSelector);
    let allAuthorsHTML = '';
    for(let author in allAuthors) {
      const authorLinkHTML = '<li> <a href="#author-' + author + '">' + author + '</a> (' +  allAuthors[author]+ ') </li>';
      allAuthorsHTML += authorLinkHTML;
    }
    authorList.innerHTML = allAuthorsHTML;
  }
  
  generateAuthors();

  function authorClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const author = href.replace('#author-', '');
    /* find all tag links with class active */
    const authorsActive = document.querySelectorAll('a.active[href^="#author-"]');
    /* START LOOP: for each active tag link */
    for(let authorActive of authorsActive) {
    /* remove class active */
      authorActive.classList.remove('active');
    /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const authorsEqual = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for(let authorEqual of authorsEqual) {
    /* add class active */
      authorEqual.classList.add('active');
    /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
  }

  
  function addClickListenersToAuthors() {
    /* find all links to tags */
    const allAuthors = document.querySelectorAll('.post-author a, .authors a');
    /* START LOOP: for each link */
    for(let allAuthor of allAuthors) {
    /* add tagClickHandler as event listener for that link */
      allAuthor.addEventListener('click', authorClickHandler);
    /* END LOOP: for each link */
    }
  }
  addClickListenersToAuthors();
}
