import got from 'got';

// Custom route created on the Week 11 WordPress site.
const dataURL =
  'https://dev-cs-5513-week-11.pantheonsite.io/wp-json/twentytwentyone-child/v1/latest-posts/1';

// Core posts route on the same site. Used only when the custom route is not registered.
const corePostsURL =
  'https://dev-cs-5513-week-11.pantheonsite.io/wp-json/wp/v2/posts?per_page=100';

function parseJsonBody(body) {
  let text = Buffer.isBuffer(body) ? body.toString('utf8') : String(body);
  // The child theme file is printed ahead of the JSON because its opening
  // PHP tag is not valid. Drop that prefix, then parse the JSON payload.
  if (text.startsWith('<7php') || text.startsWith('<?php')) {
    const leakedClose = Math.max(text.lastIndexOf('?>'), text.lastIndexOf('7>'));
    if (leakedClose >= 0) {
      text = text.slice(leakedClose + 2);
    }
  }
  const start = text.search(/[\[{]/);
  if (start < 0) {
    throw new Error('WordPress response did not contain JSON');
  }
  return JSON.parse(text.slice(start));
}

function toIsoDate(value) {
  if (!value) {
    return '';
  }
  return String(value).replace(' ', 'T');
}

function normalizePost(item) {
  if (item && (item.ID != null || item.post_title != null)) {
    return {
      ID: item.ID,
      post_title: item.post_title || 'Untitled',
      post_content: item.post_content || '',
      post_excerpt: item.post_excerpt || '',
      post_date: toIsoDate(item.post_date),
    };
  }

  const title = item?.title?.rendered || 'Untitled';
  const content = item?.content?.rendered || '';
  const excerpt = item?.excerpt?.rendered || '';
  return {
    ID: item.id,
    post_title: title,
    post_content: content,
    post_excerpt: excerpt,
    post_date: toIsoDate(item.date),
  };
}

async function readPostsFrom(url) {
  const response = await got(url, { throwHttpErrors: false });
  const json = parseJsonBody(response.body);
  if (!Array.isArray(json)) {
    return [];
  }
  return json.map(normalizePost).filter((post) => post.ID != null);
}

async function loadPosts() {
  try {
    const posts = await readPostsFrom(dataURL);
    if (posts.length > 0) {
      return posts;
    }
  } catch (error) {
    console.log(error);
  }

  try {
    return await readPostsFrom(corePostsURL);
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getAllIds() {
  const posts = await loadPosts();
  return posts.map((item) => {
    return {
      params: {
        id: item.ID.toString(),
      },
    };
  });
}

export async function getSortedList() {
  const posts = await loadPosts();
  posts.sort(function (a, b) {
    return a.post_title.localeCompare(b.post_title);
  });
  return posts.map((item) => {
    return {
      id: item.ID.toString(),
      name: item.post_title,
      date: item.post_date,
    };
  });
}

export async function getData(idRequested) {
  const posts = await loadPosts();
  const objMatch = posts.filter((obj) => {
    return obj.ID.toString() === idRequested;
  });

  if (objMatch.length > 0) {
    return objMatch[0];
  }
  return {};
}
