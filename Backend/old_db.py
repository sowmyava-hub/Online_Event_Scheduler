import mysql.connector
from mysql.connector.constants import ClientFlag

config = {
    'user': 'root',
    'password': 'root',
    'host': '34.134.18.13',
    'database': 'oes_db4',
    'client_flags': [ClientFlag.SSL],
    'ssl_ca': 'ssl/server-ca.pem',
    'ssl_cert': 'ssl/client-cert.pem',
    'ssl_key': 'ssl/client-key.pem'
}

# now we establish our connection
cnxn = mysql.connector.connect(**config)

dummy_db = {}

participant_db = {}


def save_poll_to_db(title, description, open_status, secret, location, endate, recurr_endate,
                    recurr, userid, times, votes, createdAt, updatedAt):
    # dummy_db[event_name] = [event_name, description, poll_date, from_slot, to_slot, recurring, user_type,
    #                         initiator_name, email, survey_end]
    cur = cnxn.cursor()
    query = "insert into Poll_Details(title, description, open_status, secret, location, endate, recurr_endate, " \
            "recurr, userid, createdAt, updatedAt) " \
            "values('%s','%s',%s,'%s','%s','%s', '%s', '%s', %d, '%s', '%s')"
    values = (title, description, open_status, secret, location, endate, recurr_endate, recurr, userid, createdAt['date'], updatedAt['date'])
    cur.execute(query % values)
    cnxn.commit()
    query2 = "select id from Poll_Details where secret = '%s'"
    cur.execute(query2 % secret)
    poll_id = cur.fetchall()[0][0]
    query3 = "insert into Poll_times(poll_id, start, end) values(%d,%d,%d)"
    for each in times:
        values = (poll_id, each["start"], each["end"])
        cur.execute(query3 % values)
        cnxn.commit()
    cnxn.commit()
    query3 = "insert into Votes(poll_id, name) values(%d,'%s')"
    query4 = "insert into Votes_times(voter_id, start, end) values(%d,%d,%d)"
    for i in votes:
        name = i["name"]
        times = i["times"]
        values = (poll_id, name)
        cur.execute(query3 % values)
        cnxn.commit()
        query2 = "select * from Votes"
        cur.execute(query2)
        voter_id = cur.fetchall()[-1][0]
        for each in times:
            values = (voter_id, each["start"], each["end"])
            cur.execute(query4 % values)
            cnxn.commit()
    cnxn.commit()
    # query4 = "select * from Poll_times"
    # cur.execute(query4)
    # print(cur.fetchall())
    # query4 = "select * from Votes"
    # cur.execute(query4)
    # print(cur.fetchall())
    # query4 = "select * from Poll_Details"
    # cur.execute(query4)
    # print(cur.fetchall())
    # query4 = "select * from Votes_times"
    # cur.execute(query4)
    # print(cur.fetchall())
    return poll_id


def get_from_db(poll_id, secret):
    cur = cnxn.cursor()
    query = "select * from Poll_Details where id = %d AND secret = '%s'"
    val = (poll_id, secret)
    cur.execute(query % val)
    data = cur.fetchall()
    query2 = "select * from Poll_times where poll_id = %d"
    cur = cnxn.cursor()
    cur.execute(query2 % poll_id)
    times = cur.fetchall()
    query3 = "select * from Votes where poll_id = %d"
    cur = cnxn.cursor()
    cur.execute(query3 % poll_id)
    votes = cur.fetchall()
    formatted_times = []
    for i in range(len(times)):
        formatted_times.append({"start": times[i][1], "end": times[i][2]})
    formatted_votes = []
    for i in range(len(votes)):
        voter_id = votes[i][0]
        print(voter_id)
        query4 = "select * from Votes_times where voter_id = %d"
        cur = cnxn.cursor()
        cur.execute(query4 % voter_id)
        votes_times = cur.fetchall()
        print(len(votes_times))
        voter_times = []
        for j in range(len(votes_times)):
            print(j)
            voter_times.append({"start": votes_times[j][1], "end": votes_times[j][2]})
        formatted_votes.append({"name": votes[i][2], "times": voter_times})
    print(formatted_votes)
    return data[0], formatted_times, formatted_votes


# def get_from_db(poll_id):
#     query = "select * from Initiate_Poll where Poll_Id = %d"
#     val = (poll_id)
#     cur = cnxn.cursor()
#     cur.execute(query % val)
#     data = cur.fetchall()
#     t1 = 0
#     t2 = 0
#     t3 = 0
#     #Select count query for poll id which will be given in the participants table - number of entries == t1,
#     #number of availability = True == t2
#     #number of unavailable = t1-t2 == t3
#     if data:
#         return data[0] # also return t1, t2, t3
#     else:
#         return []
#
# print(get_from_db(32))

# query_t1 = "SELECT COUNT(*) FROM Participants WHERE Poll_Id = %d"
# cur.execute(query_t1 % poll_id)
# t1 = cur.fetchall()[0][0]
#
# query_t2 = "SELECT COUNT(*) FROM Participants WHERE Poll_Id = %d AND Availability = true"
# cur.execute(query_t2 % poll_id)
# t2 = cur.fetchall()[0][0]
#
# t3 = t1 - t2

# Select count query for poll id which will be given in the participants table - number of entries == t1,
# number of availability = True == t2
# number of unavailable = t1-t2 == t3
#
# if data:
#     return data[0], t1, t2, t3
# else:
#     return []


def save_participant_to_db(participant_name, event_name, dates, time_ranges, email, password):
    participant_db[participant_name] = [event_name, dates, time_ranges, email, password]
    print(participant_db)


def get_participant_details(participant_name):
    return participant_db[participant_name]


user = {}


def get_password(email):
    return user['password']


def login(email, password):
    cur = cnxn.cursor()
    check = "select * from Sign_Up where Email_Id = '%s'"
    val = (email)
    cur.execute(check % val)
    data = cur.fetchall()
    if data:
        info = data[0]
        check = info[2]
        if check == password:
            user_id = info[0]
            email = info[1]
            return {"message": "Success", "user_id": user_id, "email": email}, 200
    return "Account Does not Exist"


def signup(email, password):
    cur = cnxn.cursor()
    check = "select * from Sign_Up where Email_Id = '%s'"
    val = (email)
    cur.execute(check % val)
    data = cur.fetchall()
    if data:
        return "Account already Exists"

    query = "insert into Sign_Up(Email_Id,Password) values('%s','%s')"
    query_val = (email, password)
    cur.execute(query % query_val)
    cnxn.commit()
    query_get = "select * from Sign_Up where Email_Id = '%s'"
    get_val = (email)
    cur.execute(query_get % get_val)
    info = cur.fetchall()[0]
    user_id = info[0]
    email_id = info[1]
    return {"message": "Account Created Successfully", "user_id": user_id, "email": email_id}, 200


# def save_participant_availability(participant_name, available, poll_id):
#     #Save participant details to participants table
#     #return participant_id (auto-incremented ID)
#
#
# def finalize_poll(poll_id, finalize):
#     # Poll table and match poll ID and update Finalize to True
#
#
# def participant_poll_get(poll_id, participant_id):
#     #return participant details (select participant id and poll id in participants table)


def save_participant_availability(participant_name, available, poll_id):
    cur = cnxn.cursor()
    query = "INSERT INTO Participants (Poll_Id, Participant_Name, Availability) VALUES (%d, '%s', %s)"
    val = (poll_id, participant_name, available)
    cur.execute(query % val)
    cnxn.commit()

    query2 = "select * from Participants where Poll_Id = %d and Participant_Name= '%s'"
    val2 = (poll_id, participant_name)
    cur.execute(query2 % val2)
    data = cur.fetchall()[0]
    return data[0]


def finalize_poll(poll_id, finalize):
    cur = cnxn.cursor()
    query = "UPDATE Initiate_Poll SET finalize = %s WHERE Poll_Id = %d"
    val = (finalize, int(poll_id))
    print(query % val)
    cur.execute(query % val)
    cnxn.commit()


def participant_poll_get(poll_id, participant_id):
    # return participant details (select participant id and poll id in participants table)
    cur = cnxn.cursor()
    query = "SELECT * FROM Participants where Poll_Id = %d AND Participant_Id = %d"
    val = (int(poll_id), int(participant_id))
    cur.execute(query % val)
    data = cur.fetchall()
    if data:
        return data[0]
    return []


def save_meeting_to_db(user_id, title, description, location, secret, times, endate, recurr, recurr_endate, recurr_event):

    cur = cnxn.cursor()
    query = "insert into Meeting(user_id,title,description" \
            ",location,secret,endate,recurr,recurr_endate) " \
            "values(%d, '%s','%s','%s','%s','%s','%s','%s')"
    values = (user_id, title, description, location, secret,
              endate,recurr,recurr_endate)
    cur.execute(query % values)
    cnxn.commit()
    query2 = "select id from Meeting where secret = '%s'"

    cur.execute(query2 % secret)
    meeting_id = cur.fetchall()[0][0]
    query3 = "insert into Meeting_times(meeting_id, start_time, end_time) values(%d,'%s','%s')"
    for each in times:
        values = (meeting_id, each["start"], each["end"])
        cur.execute(query3 % values)
        cnxn.commit()
    cnxn.commit()
    query4 = "select * from Meeting_times where meeting_id = %d"
    cur.execute(query4 % meeting_id)
    print(cur.fetchall())

    query3 = "insert into recurring_meetings(meeting_id, title, start_time, end_time," \
             "color, status) values(%d,'%s','%s','%s','%s', %d)"
    for each in recurr_event:
        values = (meeting_id, each["title"], each["start"], each["end"], each["color"],
                  each["status"])
        cur.execute(query3 % values)
        cnxn.commit()
    cnxn.commit()
    query4 = "select * from recurring_meetings where meeting_id = %d"
    cur.execute(query4 % meeting_id)
    print(cur.fetchall())
    return meeting_id


def update_recurr_event(meeting_id, recurr_event):
    cur = cnxn.cursor()
    query = "DELETE FROM recurring_meetings WHERE meeting_id = %d;"
    cur.execute(query % meeting_id)

    query2 = "insert into recurring_meetings(meeting_id, title, start_time, end_time," \
             "color, status) values(%d,'%s','%s','%s','%s', %d)"
    for each in recurr_event:
        values = (meeting_id, each["title"], each["start"], each["end"], each["color"],
                  each["status"])
        cur.execute(query2 % values)
        cnxn.commit()

    query3 = "select * from recurring_meetings where meeting_id = %d"
    cur.execute(query3 % meeting_id)
    print(cur.fetchall())


def get_meeting_from_db(user_id):
    cur = cnxn.cursor()
    # print(user_id)
    get_meetings_query = "select * from Meeting where user_id= %d"
    cur.execute(get_meetings_query % int(user_id))
    meetings = cur.fetchall()
    # print(meetings)
    data=[]
    for meeting in meetings:
        meeting_id = meeting[0]
        # print(meeting_id)
        info = {}
        info['userid'] = meeting[1]
        info['title'] = meeting[2]
        info['description'] = meeting[3]
        info['location'] = meeting[4]
        info['secret'] = meeting[5]
        info['endate'] = meeting[6]
        info['recurr'] = meeting[7]
        info['recurr_endate'] = meeting[8]

        query = "select * from Meeting_times where meeting_id = %d"
        cur.execute(query % meeting_id)
        meeting_times_all = cur.fetchall()
        # print(meeting_times_all)
        meeting_times_list=[]
        for meeting_times in meeting_times_all:
            meeting_times_info={}
            meeting_times_info['start'] = meeting_times[2]
            meeting_times_info['end'] = meeting_times[3]
            meeting_times_list.append(meeting_times_info)
        info['times'] = meeting_times_list

        query = "select * from recurring_meetings where meeting_id = %d"
        cur.execute(query % meeting_id)
        recurr_data_all = cur.fetchall()
        recurr_data_list=[]
        # print(recurr_data_all)
        for recurr_data in recurr_data_all:
            recurr_data_info={}
            recurr_data_info['event_id'] = recurr_data[0]
            recurr_data_info['title'] = recurr_data[2]
            recurr_data_info['start'] = recurr_data[3]
            recurr_data_info['end'] = recurr_data[4]
            recurr_data_info['color'] = recurr_data[5]
            recurr_data_info['status'] = recurr_data[6]
            recurr_data_list.append(recurr_data_info)
        info['recurr_event'] = recurr_data_list

        data.append(info)
    return data
