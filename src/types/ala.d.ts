interface Species {
  id: string;
  guid: string;
  linkIdentifier: string;
  idxtype: string;
  name: string;
  kingdom: string;
  nomenclaturalCode: string;
  scientificName: string;
  scientificNameAuthorship: string;
  author: string;
  nameComplete: string;
  nameFormatted: string;
  taxonomicStatus: string;
  nomenclaturalStatus: string | null;
  parentGuid: string;
  rank: string;
  rankID: number;
  commonName: string;
  commonNameSingle: string;
  occurrenceCount: number;
  conservationStatus: string | null;
  favourite: string | null;
  infoSourceName: string;
  infoSourceURL: string;
  image: string;
  imageUrl: string;
  thumbnailUrl: string;
  smallImageUrl: string;
  largeImageUrl: string;
  kingdomGuid: string;
  phylum: string;
  phylumGuid: string;
  class: string;
  classGuid: string;
  subdivision_zoology: string;
  subdivision_zoologyGuid: string;
  superorder: string;
  superorderGuid: string;
  order: string;
  orderGuid: string;
  suborder: string;
  suborderGuid: string;
  family: string;
  familyGuid: string;
  genus: string;
  genusGuid: string;
}

interface SearchResults {
  totalRecords: number;
  facetResults: unknown[];
  results: Species[];
}

interface SearchResponse {
  searchResults: SearchResults;
}
