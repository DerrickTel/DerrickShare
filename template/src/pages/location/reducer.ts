type Center<T> = {
  longitude: T;
  latitude: T;
} | null;
interface GaoDeState {
  center?: Center<number>;
  id?: string;
  select_POI?: {
    city: string;
    name: string;
    address: string;
    longitude: number;
    latitude: number;
    province: string;
  };
  mapCenter?: Center<number>;
  originCenter?: Center<number>;
}

interface GaoDeAction extends GaoDeState {
  type: string;
}


export const initialState: GaoDeState = { center: null };

export function reducer(state: GaoDeState, action: GaoDeAction) {
  switch (action.type) {
    case 'setCenter':
      return { ...state, center: action.center };
    case 'setId':
      return { ...state, id: action.id };
    case 'setSelect_POI':
      return { ...state, select_POI: action.select_POI }
    case 'setMapCenter':
      return { ...state, mapCenter: action.mapCenter }
    case 'setOriginCenter':
      return { ...state, originCenter: action.originCenter }
    default:
      return state
  }
}