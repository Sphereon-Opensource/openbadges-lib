const fetch = require('node-fetch');

const skipToNextSeparator = (data: any, separator: any) => {
    let output = data;
    while (output[0] !== separator) {
        output = output.slice(1);
    }
    return output.slice(1);
};

const extractChunks = require('png-chunks-extract');

const extractTextDataFromOpenBadgesITxtChunk = (chunkData: any) => {
    const typeOfInformationBytes = Buffer.from('openbadges', 'utf-8');
    const nullSeparator = Buffer.from([0x00]);

    /* Find Badges section. */
    const badgesStart = Buffer.concat([typeOfInformationBytes, nullSeparator]);

    /* Take remainder and start trimming flags. */
    const remainder = chunkData.slice(badgesStart.length);

    const withoutCompressionInfo = remainder.slice(2);

    const withoutLanguageTag = skipToNextSeparator(withoutCompressionInfo, 0x00);

    const withoutTranslatedKeyword = skipToNextSeparator(withoutLanguageTag, 0x00);

    return withoutTranslatedKeyword.toString('utf-8');
};

const openBadgesJsonFromBytes = (data: any) => {
    /**
     * http://www.libpng.org/pub/png/spec/1.2/PNG-Chunks.html
     */
    const openBadgesChunks = extractChunks(data)
        .filter((chunk: any) => chunk.name === 'iTXt')
        .map((chunk: any) => chunk.data)
        .map((chunkData: any) => Buffer.from(chunkData))
        .filter((chunkData: any) => chunkData.toString('utf-8').startsWith('openbadges'))
        .map((chunkData: any) => extractTextDataFromOpenBadgesITxtChunk(chunkData));

    if (!openBadgesChunks.length) {
        return null;
    }
    return openBadgesChunks[0];
};

const retrieveAssertionMetadataFromBase64 = (base64Data: string) => {
    return new Promise((resolve, reject) => {
        const json = openBadgesJsonFromBytes(Buffer.from(base64Data, 'base64'));
        if (!json) {
            reject(new Error('No Badges meta information found'));
        }

        // TODO: Verify content. Type should be "Assertion"
        resolve(JSON.parse(json));
    });
};

const retrieveBadgeClassFromUrl = (classUrl: string) => {
    return fetch(classUrl)
        // TODO: Verify response. Type should be "BadgeClass"
        .then((response: any) => response.json());
};

const retrieveBadgeIssuerInfoFromUrl = (issuerUrl: string) => {
    return fetch(issuerUrl)
        // TODO: Verify response. Type should be "Issuer"
        .then((response: any) => response.json());
};

const isValidBadgrPayload = (payload: any) => {
    return payload['@context'] === 'https://w3id.org/openbadges/v2"';
};

export {
    retrieveAssertionMetadataFromBase64,
    retrieveBadgeClassFromUrl,
    retrieveBadgeIssuerInfoFromUrl,
};
