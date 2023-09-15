CREATE TABLE Sign_Up (
                         User_Id INT NOT NULL AUTO_INCREMENT,
                         Email_Id VARCHAR(255),
                         Password VARCHAR(255),
                         PRIMARY KEY (User_Id)
);

CREATE TABLE Recurrence_Table (
                                  Recurrence_Id INT NOT NULL AUTO_INCREMENT,
                                  Recurrence_Type VARCHAR(255),
                                  PRIMARY KEY (Recurrence_Id)
);

CREATE TABLE Slot_Details (
                              Slot_Id INT NOT NULL AUTO_INCREMENT,
                              From_Slot TIME,
                              To_Slot TIME,
                              PRIMARY KEY (Slot_Id)
);

CREATE TABLE Create_Meeting (
                                Meeting_Id INT NOT NULL AUTO_INCREMENT,
                                Number_persons INT,
                                Meeting_name varchar(255),
                                User_id INT,
                                Recurrence_Id INT,
                                Recurrence_value VARCHAR(255),
                                date DATE,
                                PRIMARY KEY (Meeting_Id),
                                FOREIGN KEY (User_id) REFERENCES Sign_Up(User_Id),
                                FOREIGN KEY (Recurrence_Id) REFERENCES Recurrence_Table(Recurrence_Id)
);

CREATE TABLE Schedule (
                          Schedule_Id INT NOT NULL AUTO_INCREMENT,
                          Email_Id VARCHAR(40),
                          User_Id INT,
                          From_Slot TIME,
                          To_Slot TIME,
                          Status INT,
                          Meeting_Id INT,
                          User_Type INT,
                          PRIMARY KEY (Schedule_Id),
                          FOREIGN KEY (User_Id) REFERENCES Sign_Up(User_Id),
                          FOREIGN KEY (Meeting_Id) REFERENCES Create_Meeting(Meeting_Id)
);

CREATE TABLE Booking_Page (
                              Booking_Id INT NOT NULL AUTO_INCREMENT,
                              User_Id INT,
                              Created_On DATETIME,
                              Recurrence_Id INT,
                              Recurrence_value VARCHAR(255),
                              date DATE,
                              PRIMARY KEY (Booking_Id),
                              FOREIGN KEY (Recurrence_Id) REFERENCES Recurrence_Table(Recurrence_Id)
);

CREATE TABLE Booking_Slots (
                               Bk_Slot_Id INT NOT NULL AUTO_INCREMENT,
                               From_Slot TIME,
                               Event_name varchar(255),
                               To_Slot TIME,
                               Booking_Id INT,
                               User_Id INT,
                               Slot_Status INT,
                               PRIMARY KEY (Bk_Slot_Id),
                               FOREIGN KEY (Booking_Id) REFERENCES Booking_Page(Booking_Id),
                               FOREIGN KEY (User_Id) REFERENCES Sign_Up(User_Id)
);

CREATE TABLE Utilities (
                           Util_Id INT AUTO_INCREMENT PRIMARY KEY,
                           User_Id INT,
                           User_Name VARCHAR(255),
                           From_Slot TIME,
                           To_Slot TIME,
                           Booking_Id INT,
                           FOREIGN KEY (User_Id) REFERENCES Sign_Up(User_Id)
);

CREATE TABLE Initiate_Poll (
                               Poll_Id INT AUTO_INCREMENT PRIMARY KEY,
                               Event_name varchar(255),
                               Description varchar(255),
                               Initiator_name varchar(255),
                               Email varchar(255),
                               From_Slot varchar(255),
                               To_Slot varchar(255),
                               date DATE,
                               survey_end varchar(255),
                               finalize BOOLEAN DEFAULT FALSE,
                               timezone varchar(255),
                               Recurring boolean,
                               User_type int
);

CREATE TABLE Participants (
                              Participant_Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                              Poll_Id INT,
                              Participant_Name VARCHAR(255),
                              Availability BOOLEAN DEFAULT FALSE,
                              FOREIGN KEY (Poll_Id) REFERENCES Initiate_Poll(Poll_Id)
);

CREATE TABLE Poll_Details (
                              id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                              title VARCHAR(255) NOT NULL,
                              description VARCHAR(255),
                              open_status BOOLEAN DEFAULT TRUE,
                              secret VARCHAR(255),
                              location VARCHAR(255),
                              endate VARCHAR(255),
                              recurr_endate VARCHAR(255),
                              recurr VARCHAR(255),
                              userid INT,
                              createdAt VARCHAR(255),
                              updatedAt VARCHAR(255),
                              finalTime_start BIGINT,
                              finalTime_end BIGINT
);

CREATE TABLE Meeting (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         user_id INT,
                         title VARCHAR(255),
                         description VARCHAR(255),
                         location VARCHAR(255),
                         secret VARCHAR(255),
                         endate VARCHAR(255),
                         recurr VARCHAR(255),
                         recurr_endate VARCHAR(255)
);

CREATE TABLE Meeting_times (
                               id INT AUTO_INCREMENT PRIMARY KEY,
                               meeting_id INT,
                               start_time VARCHAR(255),
                               end_time VARCHAR(255),
                               FOREIGN KEY (meeting_id) REFERENCES Meeting(id)
);

CREATE TABLE recurring_meetings (
                                    id INT AUTO_INCREMENT PRIMARY KEY,
                                    meeting_id INT,
                                    title VARCHAR(255),
                                    start_time VARCHAR(255),
                                    end_time VARCHAR(255),
                                    color VARCHAR(255),
                                    status INT,
                                    FOREIGN KEY (meeting_id) REFERENCES Meeting(id)
);

CREATE TABLE Poll_times(
                           poll_id INT,
                           start BIGINT,
                           end BIGINT,
                           FOREIGN KEY (poll_id) REFERENCES Poll_Details(id)
);

CREATE TABLE Votes(
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           poll_id INT,
                           name VARCHAR(255),
                           FOREIGN KEY (poll_id) REFERENCES Poll_Details(id)
);

CREATE TABLE Votes_times(
                      voter_id INT,
                      start BIGINT,
                      end BIGINT,
                      FOREIGN KEY (voter_id) REFERENCES Votes(id)
);

