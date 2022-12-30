import mysql.connector
import os


class StocksDAO:
    def __init__(self):
        self.host=       os.environ["MYSQL_HOST"]
        self.user=       os.environ["MYSQL_USER"]
        self.password=   os.environ["MYSQL_PASSWORD"]
        self.database=   os.environ["MYSQL_DB"]

    def getcursor(self): 
        self.connection = mysql.connector.connect(
            host=       self.host,
            user=       self.user,
            password=   self.password,
            database=   self.database,
        )
        self.cursor = self.connection.cursor()
        return self.cursor

    def closeAll(self):
        self.connection.close()
        self.cursor.close()
         
    def create(self, values):
        cursor = self.getcursor()
        sql="insert into stocks (ticker, sname, pprice, quantity) values (%s,%s,%s,%s)"
        cursor.execute(sql, values)

        self.connection.commit()
        newid = cursor.lastrowid
        self.closeAll()
        return newid

    def getAll(self):
        cursor = self.getcursor()
        sql="select * from stocks"
        cursor.execute(sql)
        results = cursor.fetchall()
        returnArray = []
        print(results)
        for result in results:
            print(result)
            returnArray.append(self.convertToDictionary(result))
        
        self.closeAll()
        return returnArray

    def findByID(self, id):
        cursor = self.getcursor()
        sql="select * from stocks where id = %s"
        values = (id,)

        cursor.execute(sql, values)
        result = cursor.fetchone()
        returnvalue = self.convertToDictionary(result)
        self.closeAll()
        return returnvalue

    def update(self, values):
        cursor = self.getcursor()
        sql="update stocks set ticker=%s, sname=%s, pprice=%s, quantity=%s where id = %s"
        cursor.execute(sql, values)
        self.connection.commit()
        self.closeAll()
        
    def delete(self, id):
        cursor = self.getcursor()
        sql="delete from stocks where id = %s"
        values = (id,)

        cursor.execute(sql, values)

        self.connection.commit()
        self.closeAll()
        
        print("delete done")

    def convertToDictionary(self, result):
        colnames=['id', 'ticker', 'sname', "pprice", "quantity"]
        item = {}
        
        if result:
            for i, colName in enumerate(colnames):
                value = result[i]
                item[colName] = value
        
        return item

    # Create if not exists
    # https://stackoverflow.com/a/25621844/19501420
    def createtable(self):
        cursor = self.getcursor()
        sql="create table if not exists stocks (id int AUTO_INCREMENT NOT NULL PRIMARY KEY, ticker varchar(8), sname varchar(250), pprice float(4,2), quantity float(10,2))"
        cursor.execute(sql)

        self.connection.commit()
        self.closeAll()

    def createdatabase(self):
        self.connection = mysql.connector.connect(
            host=       self.host,
            user=       self.user,
            password=   self.password   
        )
        self.cursor = self.connection.cursor()
        sql="create database if not exists "+ self.database
        self.cursor.execute(sql)

        self.connection.commit()
        self.closeAll()