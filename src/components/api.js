
export const GetApiService = async (url) => {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": "b8416f2680eb194d61b33f9909f94b9d",
            "Content-Type": "application/json",
        }
    });

    const data = await response.json();

    return data;
};

export const PostApiService = async (url, body) => {
    const response = await fetch(url, {
        method: "POST",
        body: body,
        headers: {
            "Authorization": "b8416f2680eb194d61b33f9909f94b9d",
            "Content-Type": "application/json",
        }
    });

    const data = await response.json();

    return data;
}

export const PostAttachmentService = async (url, body) => {
    const response = await fetch(url, {
        method: "POST",
        body: body,
        headers: {
            "Authorization": "b8416f2680eb194d61b33f9909f94b9d"
          }
    });

    const data = await response.json();

    return data;
}