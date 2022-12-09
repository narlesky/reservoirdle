"""
reservoirdle

CA Reservoir Lake Outline Flashcards

"""
import json
import geopandas as gpd
from shapely.geometry import Polygon, MultiPolygon

gdf = gpd.read_file('NHD_Major_Lakes_and_Reservoirs/NHD_Major_Lakes_and_Reservoirs.shp')
# gdf.explode(index_parts=True)
# gdf.crs = 'epsg:3857'
gdf = gdf.to_crs(epsg=4326)


lakes_position = []
lakes_area = {}
for lake in gdf.gnis_name.unique():

    code = lake.replace(' ', '').replace("'", '').lower()

    if lake is None:
        continue

    frame = gdf.loc[gdf['gnis_name']==lake]

    print(frame.geometry.centroid)

    try:
        frame.head(1)['gnis_id'].values[0]
    except:
        print(type(lake))

    try:
        geometry = MultiPolygon(frame.unary_union)
    except:
        geometry = frame.unary_union
    centroid = gpd.GeoSeries(geometry).centroid[0]

    print(centroid)

    try:
        n = len(geometry.geoms)
    except:
        n = frame.shape[0]

    gpd.GeoDataFrame(index=list(range(n)), data={
        'gnis_id': frame.head(1)['gnis_id'].values[0],
        'gnis_name': lake,
        'area': frame.areasqkm.sum(),
        'geometry': geometry,
        'longitude': centroid.x,
        'latitude': centroid.y,
    }).to_file(f'lakes/{code}.geojson', driver='GeoJSON')

    lakes_position.append({
        'code': code,
        'latitude': centroid.y,
        'longitude': centroid.x,
        'name': lake,
    })

    lakes_area.update({
        code: int(frame.areasqkm.sum()),
    })

    # mapshaper oroville_0.geojson -o oroville_0.svg
    # mapshaper oroville_1.geojson -o oroville_1.svg
with open('lakes_position.json', 'w') as f:
    json.dump(lakes_position, f, indent=2)


with open('lakes_area.json', 'w') as f:
    json.dump(lakes_area, f, indent=2)