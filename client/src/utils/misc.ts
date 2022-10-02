export const getQueryParameter = (
    name: string,
    searchParams = location.search
) => {
    return new URLSearchParams(searchParams).get(name) ?? "";
};

export const setQueryParameter = (
    values: { [key: string]: string },
    original = location.search
) => {
    const params = new URLSearchParams(original);
    for (const key in values) {
        params.set(key, values[key]);
    }
    return location.href + "?" + params.toString();
};

export const getRandomRoomCode = () => {
    return String(Math.floor(Math.random() * 100000));
};
