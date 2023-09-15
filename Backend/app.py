
from flask import Flask, request, jsonify
import db_save_get
from flask_expects_json import expects_json
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

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

@app.route('/example')
def example():
    response = jsonify({'message': 'Hello, world!'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/api/poll/create", methods=['POST'])
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
        createdAt = data['createdAt']
        updatedAt = data['updatedAt']
    except:
        return {"message": "Issue in required input fields", "status": 402}, 402
    try:
        poll_id = db_save_get.save_poll_to_db(title, description, open_status, secret, location, endate, recurr_endate,
                                    recurr, userid, times, createdAt, updatedAt)
        return {"Poll ID": poll_id, "status": 200}, 200
    except:
        return {"message": title+" error in saving to DB", "status": 403}, 403


@app.route("/api/poll", methods=['GET'])
@app.route("/poll", methods=['GET', 'PUT', 'DELETE'])
def get_poll():
    args = request.args
    poll_id = int(args.get('pollID'))
    secret = args.get('secret')
    if request.method == 'GET':
        data = {}
        try:
            poll_details, times, votes = db_save_get.get_poll_from_db(poll_id, secret)
            data['pollID'] = poll_details[0]
            data['title'] = poll_details[1]
            data['description'] = poll_details[2]
            data['open'] = poll_details[3]
            data['secret'] = poll_details[4]
            data['location'] = poll_details[5]
            data['endate'] = poll_details[6]
            data['recurr_endate'] = poll_details[7]
            data['recurr'] = poll_details[8]
            data['userid'] = poll_details[9]
            data['createdAt'] = {'date': poll_details[10]}
            data['updatedAt'] = {'date': poll_details[11]}
            finalTime_start = poll_details[12]
            finalTime_end = poll_details[13]
            data['finalTime'] = {"start": finalTime_start, "end": finalTime_end}
            data['times'] = times
            data['votes'] = votes
            return data, 200
        except:
            return {"message": str(poll_id)+" error in retrieving from DB", "status": 403}, 403
    elif request.method == 'PUT':
        data = request.get_json()
        updatedAt = data['updatedAt']["date"]
        finalTime_start = data['finalTime']["start"]
        finalTime_end = data['finalTime']["end"]
        open_status = data['open']
        try:
            db_save_get.mark_final_time(poll_id, secret, updatedAt, finalTime_end, finalTime_start, open_status)
            return {"message": str(poll_id)+" final time marked successfully", "status": 200}, 200
        except:
            return {"message": str(poll_id)+" final time not marked successfully", "status": 403}, 403
    elif request.method == 'DELETE':
        try:
            poll_id = db_save_get.del_poll(poll_id, secret)
            if poll_id == -1:
                return {"message": "poll not deleted, secret incorrect or poll does not exist", "status": 406}, 406
            return {"message": str(poll_id)+" deleted successfully", "status": 200}, 200
        except:
            return {"message": str(poll_id)+" not deleted", "status": 403}, 403

@app.route("/participant", methods=['GET', 'PUT'])
def get_poll_part_view():
    args = request.args
    poll_id = int(args.get('pollID'))
    if request.method == 'GET':
        data = {}
        try:
            poll_details, times, votes = db_save_get.get_poll_from_db(poll_id, 0)
            data['pollID'] = poll_details[0]
            data['title'] = poll_details[1]
            data['description'] = poll_details[2]
            data['open'] = poll_details[3]
            data['location'] = poll_details[5]
            data['endate'] = poll_details[6]
            data['recurr_endate'] = poll_details[7]
            data['recurr'] = poll_details[8]
            data['userid'] = poll_details[9]
            data['createdAt'] = {'date': poll_details[10]}
            data['updatedAt'] = {'date': poll_details[11]}
            finalTime_start = poll_details[12]
            finalTime_end = poll_details[13]
            data['finalTime'] = {"start": finalTime_start, "end": finalTime_end}
            data['times'] = times
            data['votes'] = votes
            if data['open']:
                return data, 200
            else:
                return {"message": data['title']+" poll is closed", "status": 405}, 405
        except:
            return {"message": str(poll_id)+" error in retrieving from DB", "status": 403}, 403
    if request.method == 'PUT':
        data = request.get_json()
        try:
            poll_id = db_save_get.mark_times(poll_id, data['votes'])
        except:
            return {"message": str(poll_id)+" error in saving to DB", "status": 403}, 403

        if data['open']:
            return {"message": str(poll_id)+" times marked for participant", "status": 200}, 200
        else:
            return {"message": data['title']+" poll is closed", "status": 405}, 405


@app.route("/login", methods=['POST'])
@expects_json(login_schema)
def do_login():
    data = request.get_json()
    email = data['email']
    password = data['password']
    response, code = db_save_get.login(email, password)
    return response, code


@app.route("/signup", methods=['POST'])
@expects_json(signup_schema)
def do_signup():
    data = request.get_json()
    email = data['email']
    password = data['password']
    response, code = db_save_get.signup(email, password)
    return response, code


@app.route("/api/meeting/create", methods=['POST'])
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


app.run(host="0.0.0.0", port=5009)
