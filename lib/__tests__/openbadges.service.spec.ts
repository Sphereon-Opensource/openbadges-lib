import * as fs from 'fs';
import {openBadgesJsonFromBytes, retrieveAssertionMetadataFromBase64} from "../openbadges.service";

const filename = 'lib/__tests__/resources/assertion-fn7VVVadQBW5x4tSapynOw.png';

const dummyAssertionBase64 = fs.readFileSync(filename, {encoding: 'base64'});

describe('OpenBadges service', () => {
    test('should extract openbadges info', async () => {
        const openBadgesInfo: any = await retrieveAssertionMetadataFromBase64(dummyAssertionBase64);

        expect(openBadgesInfo["@context"]).toEqual('https://w3id.org/openbadges/v2');
        expect(openBadgesInfo.type).toEqual('Assertion');
        expect(openBadgesInfo.id).toEqual('https://api.blockchange.dev.sphereon.com/public/assertions/fn7VVVadQBW5x4tSapynOw');
        expect(openBadgesInfo.badge).toEqual('https://api.blockchange.dev.sphereon.com/public/badges/Wtips4_jS_SItVRIL3E3eg');
        expect(openBadgesInfo.issuedOn).toEqual('2020-01-07T11:11:53.497016+00:00');
        expect(openBadgesInfo.recipient.identity).toEqual('sha256$2793ecb302f076f8d73cecde8998103174c5d89731a4cd8483a64847f20af2d7');
    });
});
