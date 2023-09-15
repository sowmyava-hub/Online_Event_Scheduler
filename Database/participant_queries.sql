insert into Poll_Details(title, description, open_status, secret, location, endate, recurr_endate, 
            recurr, userid, createdAt, updatedAt) 
            values('%s','%s',%s,'%s','%s','%s', '%s', '%s', %d, '%s', '%s');
            
select * from Poll_Details;

insert into Poll_times(poll_id, start, end) values(%d,%d,%d);

select * from Poll_Details where id = %d AND secret = '%s';

select * from Poll_Details where id = %d;

select * from Votes_times where voter_id = %d;

insert into Votes(poll_id, name) values(%d,'%s');
insert into Votes_times(voter_id, start, end) values(%d,%d,%d);

update Poll_Details SET updatedAt = '%s', finalTime_start = %d, finalTime_end = %d, open = %s
where id = %d AND secret = '%s';

DELETE FROM Votes_times WHERE voter_id = %d;

select * from Sign_Up where Email_Id = '%s';

insert into Sign_Up(Email_Id,Password) values('%s','%s');

insert into Meeting(user_id,title,description,location,secret,endate,recurr,recurr_endate)
values(%d, '%s','%s','%s','%s','%s','%s','%s');

insert into Meeting_times(meeting_id, start_time, end_time) values(%d,'%s','%s');

insert into recurring_meetings(meeting_id, title, start_time, end_time,color, status) values(%d,'%s','%s','%s','%s', %d);


