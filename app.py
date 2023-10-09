# Import the dependencies.
import numpy as np
import datetime as dt
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify
from flask_cors import CORS

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///Resources/air_quality_final.db")

# reflect an existing database into a new model
Base = automap_base()
Base.prepare(autoload_with = engine)
# reflect the tables
quality = Base.classes.quality


# Save references to each table


# Create our session (link) from Python to the DB
# session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
CORS(app)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"/api/v1.0/airquality_data"

    )
@app.route("/api/v1.0/airquality_data")
def airquality():

    session = Session(engine)



    plot_data = session.query(quality.Date, quality.aqi, quality.CO, quality.NO, quality.NO2, quality.O3, quality.SO2, quality.pm2_5, quality.pm10, quality.NH3).all()

    session.close()
    all_p = []
    for date, aqi, co, no,no2, o3,so2,pm2, pm10,nh3 in plot_data:
        dict = {}
        dict["date"] = date
        dict["aqi"] = aqi
        dict["CO"] = co
        dict["NO"] = no
        dict["NO2"] = no2
        dict["O3"] = o3
        dict["SO2"] = so2
        dict["pm2_5"] = pm2
        dict["pm10"] = pm10
        dict["NH3"] = nh3




        all_p.append(dict)
 

    return jsonify(all_p)





if __name__ == '__main__':
    app.run(debug=True)
