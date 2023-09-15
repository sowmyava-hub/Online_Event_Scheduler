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

cnxn = mysql.connector.connect(**config)


def save_poll_to_db(title, description, open_status, secret, location, endate, recurr_endate,
                    recurr, userid, times, createdAt, updatedAt):
    cur = cnxn.cursor()
    query = "insert into Poll_Details(title, description, open_status, secret, location, endate, recurr_endate, " \
            "recurr, userid, createdAt, updatedAt) " \
            "values('%s','%s',%s,'%s','%s','%s', '%s', '%s', %d, '%s', '%s')"
    values = (title, description, open_status, secret, location, endate, recurr_endate, recurr, userid, createdAt['date'], updatedAt['date'])
    cur.execute(query % values)
    cnxn.commit()
    query2 = "select * from Poll_Details"
    cur.execute(query2)
    poll_id = cur.fetchall()[-1][0]
    query3 = "insert into Poll_times(poll_id, start, end) values(%d,%d,%d)"
    for each in times:
        values = (poll_id, each["start"], each["end"])
        cur.execute(query3 % values)
        cnxn.commit()
    return poll_id


def get_poll_from_db(poll_id, secret):
    cur = cnxn.cursor()
    if secret:
        query = "select * from Poll_Details where id = %d AND secret = '%s'"
        val = (poll_id, secret)
        cur.execute(query % val)
        data = cur.fetchall()
    else:
        query = "select * from Poll_Details where id = %d"
        cur.execute(query % poll_id)
        data = cur.fetchall()
    query2 = "select * from Poll_times where poll_id = %d"
    cur.execute(query2 % poll_id)
    times = cur.fetchall()
    query3 = "select * from Votes where poll_id = %d"
    cur.execute(query3 % poll_id)
    votes = cur.fetchall()
    formatted_times = []
    for i in range(len(times)):
        formatted_times.append({"start": times[i][1], "end": times[i][2]})
    formatted_votes = []
    for i in range(len(votes)):
        voter_id = votes[i][0]
        query4 = "select * from Votes_times where voter_id = %d"
        cur.execute(query4 % voter_id)
        votes_times = cur.fetchall()
        voter_times = []
        for j in range(len(votes_times)):
            voter_times.append({"start": votes_times[j][1], "end": votes_times[j][2]})
        formatted_votes.append({"name": votes[i][2], "times": voter_times})
    return data[0], formatted_times, formatted_votes


def mark_times(poll_id, votes):
    cur = cnxn.cursor()
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
    return poll_id


def mark_final_time(poll_id, secret, updatedAt, finalTime_start, finalTime_end, open_status):
    cur = cnxn.cursor()
    query = "update Poll_Details SET updatedAt = '%s', finalTime_start = %d, finalTime_end = %d, open = %s " \
            "where id = %d AND secret = '%s'"
    values = (updatedAt, finalTime_start, finalTime_end, open_status, poll_id, secret)
    cur.execute(query % values)
    cnxn.commit()
    query2 = "select * from Poll_Details"
    cur.execute(query2)
    return poll_id


def del_poll(poll_id, secret):
    cur = cnxn.cursor()
    query = "select * from Poll_Details where id = %d AND secret = '%s'"
    values = (poll_id, secret)
    cur.execute(query % values)
    data = cur.fetchall()
    if not data:
        return -1
    query = "DELETE FROM Poll_times WHERE poll_id = %d;"
    cur.execute(query % poll_id)
    cnxn.commit()
    query = "SELECT id FROM Votes WHERE poll_id = %d"
    cur.execute(query % poll_id)
    votes = cur.fetchall()
    for i in votes:
        query = "DELETE FROM Votes_times WHERE voter_id = %d;"
        cur.execute(query % i[0])
        cnxn.commit()
    query = "DELETE FROM Votes WHERE poll_id = %d;"
    cur.execute(query % poll_id)
    cnxn.commit()
    query = "DELETE FROM Poll_Details WHERE id = %d;"
    cur.execute(query % poll_id)
    cnxn.commit()
    return poll_id


def login(email: object, password: object) -> object:
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
    return {"message": "Account does not exist", "email": email, "status": 408}, 200


def signup(email, password):
    cur = cnxn.cursor()
    check = "select * from Sign_Up where Email_Id = '%s'"
    val = (email)
    cur.execute(check % val)
    data = cur.fetchall()
    if data:
        return {"message": "Account already exists", "email": email, "status": 409}, 200

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
    get_meetings_query = "select * from Meeting where user_id= %d"
    cur.execute(get_meetings_query % int(user_id))
    meetings = cur.fetchall()
    data = []
    for meeting in meetings:
        meeting_id = meeting[0]
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
