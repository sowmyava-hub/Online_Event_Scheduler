
from flask import Flask, request, jsonify
from datetime import datetime, timedelta, date
from pytz import timezone, utc
import db_save_get
from common import validate_json, validate_schema
from flask_expects_json import expects_json

app = Flask(__name__)

initiate_poll_schema = {
    'type': 'object',
    'properties': {
        "title": {'type': 'string'},
        "description": {'type': 'string'},
        "location": {'type': 'string'},
        "secret": {'type': 'string'},
        "times": {'type': 'array'},
        "timezone-val": {'type': 'string'},
        "timezone-code": {'type': 'integer'},
        "survey-endtime": {'type': 'string'},
        "recurrence-val": {'type': "boolean"},
        "recurrence-code": {'type': 'integer'},
        "isdifference": {'type': 'boolean'}
    },
    'required': ["title", "times", "timezone-val", "secret", "survey-endtime", "recurrence-code"]
}

login_schema = {
    'type': 'object',
    'properties': {
        "email": {'type': 'string'},
        "password": {'type': "string"},
    },
    'required': ["email", "password"]
}

signup_schema = {
    'type': 'object',
    'properties': {
        "email": {'type': 'string'},
        "password": {'type': "string"},
    },
    'required': ["email", "password"]
}

get_poll_schema = {
    'type': 'object',
    'properties': {
        # "event_name": {'type': 'string'},
        "poll_id": {'type': 'integer'}
    },
    'required': ["poll_id"]
}

poll_participants_schema = {
    'type': 'object',
    'properties': {
        "participant_name": {'type': 'string'},
        "event_name": {'type': 'string'},
        "dates": {'type': 'array'},
        "time_ranges": {'type': 'array'},
        "timezone": {'type': "string"},
        "email": {'type': 'string'},
        "password": {'type': 'string'}
    },
    'required': ["participant_name", "event_name", "dates", "time_ranges", "timezone"]
}

format = "%Y-%m-%d %H:%M:%S %Z%z"

# /api/poll/create POST
# /api/poll/{poll_id}/{secret} -- full payload GET with votes (nil in table, then empty) -- if open give data, if not then give 405
# /participant/{poll_id} GET
# /poll/{poll_id}/{secret} GET
# /participant/{poll_id} PUT -- mark times
# /poll/{pollID}/{secret} -- mark final times (final time new field, add that to poll table)
# /poll/${pollID}/${secret} DELETE -- delete entry from db

#mark final time
#delete poll id from db
#405 for not found in db
#http://localhost:3000/participant/64481171ae3156776b2af744


@app.route("/api/poll/create", methods=['POST'])
# @expects_json(initiate_poll_schema)
def initiate_poll():
    try:
        data = request.get_json()
        title = data['title']
        description = data['description']
        open_status = data['open']
        secret = data['secret']
        location = data['location']
        endate = data['endate']
        recurr_endate = data['recurr_endate']
        recurr = data['recurr']
        userid = data['userid']
        times = data['times']
        votes = data['votes']
        createdAt = data['createdAt']
        updatedAt = data['updatedAt']
    except:
        return {"message": "Issue in required input fields", "status": 402}, 402
    try:
        poll_id = db_save_get.save_poll_to_db(title, description, open_status, secret, location, endate, recurr_endate,
                                              recurr, userid, times, votes, createdAt, updatedAt)
        return {"poll ID": poll_id, "status": 200}, 200
    except:
        return {"message": title+" error in saving to DB", "status": 403}, 403

@app.route("/api/poll", methods=['GET'])
# @expects_json(get_poll_schema)
def get_poll():
    args = request.args
    poll_id = int(args.get('pollID'))
    secret = args.get('secret')
    data = {}
    poll_details, times, votes = db_save_get.get_from_db(poll_id, secret)
    data['pollID'] = poll_details[0]
    data['title'] = poll_details[1]
    data['description'] = poll_details[2]
    data['open_status'] = poll_details[3]
    data['secret'] = poll_details[4]
    data['location'] = poll_details[5]
    data['endate'] = poll_details[6]
    data['recurr_endate'] = poll_details[7]
    data['recurr'] = poll_details[8]
    data['userid'] = poll_details[9]
    data['createdAt'] = poll_details[10]
    data['updatedAt'] = poll_details[11]
    data['finalTime_start'] = poll_details[12]
    data['finalTime_end'] = poll_details[13]
    data['times'] = times
    data['votes'] = votes
    return {"Poll details": data}, 200


# @app.route("/get_poll", methods=['GET'])
# # @expects_json(get_poll_schema)
# def get_poll():
#     args = request.args
#     poll_id = args.get('poll_id')
#     event_details, t1, t2, t3= save_to_db.get_from_db(int(poll_id))
#     data = {}
#     if event_details:
#         data['poll_id'] = event_details[0]
#         data['event_name'] = event_details[1]
#         data['description'] = event_details[2]
#         data['initiator_name'] = event_details[3]
#         data['email'] = event_details[4]
#         data['from_slot'] = event_details[5]
#         data['to_slot'] = event_details[6]
#         data['poll_date'] = event_details[7]
#         data['survey_end'] = event_details[8]
#         data['timezone'] = event_details[9]
#         data['recurring'] = event_details[10]
#         data['user_type'] = event_details[11]
#         data['finalize'] = event_details[12]
#         data['total_participants'] = t1
#         data['available_participants'] = t2
#         data['unavailable_participants'] = t3
#     else:
#         return {"message": "Could not find poll with given details", "status": 405}, 405
#     return data
# for each in times:
#     old_timezone = timezone(timezone_val)
#     new_timezone = timezone("UTC")
#     localized_timestamp = old_timezone.localize(datetime.strptime(each["start"], "%Y-%m-%d %H:%M:%S"))
#     from_slot = localized_timestamp.astimezone(new_timezone)
#     localized_timestamp = old_timezone.localize(datetime.strptime(each["end"], "%Y-%m-%d %H:%M:%S"))
#     to_slot = localized_timestamp.astimezone(new_timezone)
#     times_new.append({"start": from_slot, "end": to_slot})
#     temp_date = survey_endtime.split(" ")[0]
#     temp_date = datetime.strptime(temp_date, '%Y-%m-%d').date()
#     temp_date = temp_date + timedelta(days=7)
#     temp_date = str(temp_date) + " " + survey_endtime.split(" ")[1]
#     old_timezone = timezone(timezone_val)
#     new_timezone = timezone("UTC")
#     localized_timestamp = old_timezone.localize(datetime.strptime(temp_date, "%Y-%m-%d %H:%M:%S"))
#     expirydate = localized_timestamp.astimezone(new_timezone)
#     print(expirydate)


@app.route("/participant_info", methods=['POST'])
@expects_json(poll_participants_schema)
def participant_info():
    data = request.get_json()
    participant_name = data['participant_name']
    event_name = data['event_name']
    dates = data['dates']
    time_ranges = data['time_ranges']
    time_zone = data['timezone']
    for t in range(len(time_ranges)):
        old_timezone = timezone(time_zone)
        new_timezone = timezone("US/Eastern")
        localized_timestamp = old_timezone.localize(datetime.strptime(time_ranges[t][0], "%Y-%m-%d %H:%M:%S"))
        time_ranges[t][0] = localized_timestamp.astimezone(new_timezone)
        localized_timestamp = old_timezone.localize(datetime.strptime(time_ranges[t][1], "%Y-%m-%d %H:%M:%S"))
        time_ranges[t][1] = localized_timestamp.astimezone(new_timezone)
    try:
        email = data['email']
        password = data['password']
    except:
        email = ""
        password = ""
    db_save_get.save_participant_to_db(participant_name, event_name, dates, time_ranges, email, password)
    return jsonify(data, 202)

@app.route("/get_participant_details", methods=['GET'])
def get_participant_details():
    args = request.args
    participant_name = args.get('participant_name')
    event_name = args.get('event_name')
    participant_details = db_save_get.get_participant_details(participant_name)
    if participant_details[0] == event_name:
        return jsonify(participant_details, 202)

@app.route("/login", methods=['POST'])
@expects_json(login_schema)
def do_login():
    data = request.get_json()
    email = data['email']
    password = data['password']
    data = db_save_get.login(email, password)
    return data

@app.route("/signup", methods=['POST'])
@expects_json(signup_schema)
def do_signup():
    data = request.get_json()
    email = data['email']
    password = data['password']
    data = db_save_get.signup(email, password)
    return data



#######New APIs 24Mar
@app.route("/participant_availability", methods=['POST'])
def participant_availability():
    data = request.get_json()
    participant_name = data['participant_name']
    available = data['available_status']
    poll_id = data['poll_id']
    participant_id = db_save_get.save_participant_availability(participant_name, available, poll_id)
    return {"message": "success", "status": 200, "participant_id": participant_id}

@app.route("/get_participant_poll", methods=['GET'])
def participant_poll_get():
    args = request.args
    poll_id = args.get('poll_id')
    participant_id = args.get('participant_id')
    res = db_save_get.participant_poll_get(poll_id, participant_id)
    data = {}
    if res:
        data['participant_Id'] = res[0]
        data['poll_id'] = res[1]
        data['participant_name'] = res[2]
        data['availability'] = res[3]
        return jsonify(data,200)
    else:
        return "No participant match"

@app.route("/finalize_poll", methods=['POST'])
def finalize_poll():
    args = request.args
    poll_id = args.get('poll_id')
    if args.get('finalize')=="true" or args.get('finalize')=="TRUE" or args.get('finalize')=="True":
        finalize = True
    elif args.get('finalize')=="false" or args.get('finalize')== "FALSE" or args.get('finalize')== "False":
        finalize = False
    db_save_get.finalize_poll(poll_id, finalize)
    return jsonify("Saved",202)


# meeting APIs

@app.route("/api/meeting/create", methods=['POST'])
# @expects_json(initiate_poll_schema)
def create_meeting():
    try:
        data = request.get_json()
        user_id = data['userid']
        title = data['title']
        description = data['description']
        location = data['location']
        secret = data['secret']
        times = data['times']
        endate = data['endate']
        recurr = data['recurr']
        recurr_endate = data['recurr_endate']
        recurr_event = data['recurr_event']
    except:
        return {"message": "Issue in required input fields", "status": 405}, 405
    try:
        meeting_id = db_save_get.save_meeting_to_db(user_id, title, description, location, secret, times, endate, recurr, recurr_endate,
                                                    recurr_event)
        return {"message": title, "user_id": user_id, "meeting_id": meeting_id, "status": 200}, 200
    except:
        return {"message": title+" error in saving to DB", "status": 402}, 402

@app.route("/api/meeting", methods=['GET'])
def get_meeting():
    args = request.args
    user_id = args.get('userid')
    data = db_save_get.get_meeting_from_db(user_id)

    return {"Meeting details": data}, 200

@app.route("/api/meeting_registration", methods=['PUT'])
def meeting_registration():
    try:
        data = request.get_json()
        meeting_id = data['meeting_id']
        recurr_event = data['recurr_event']
    except:
        return {"message": "Issue in required input fields", "status": 405}, 405
    try:
        db_save_get.update_recurr_event(meeting_id, recurr_event)
        return {"message": "success", "status": 200}
    except:
        return {"message": meeting_id+" error in registration", "status": 402}, 402

<<<<<<< HEAD:Backend/old_poll_meeting.py
app.run(host="0.0.0.0", port=5009)
=======
app.run(host="0.0.0.0", port=5012)
>>>>>>> bfc960d39fc6c6e0dd08ee55ecdcede9e23afe27:Backend/poll_meeting.py
