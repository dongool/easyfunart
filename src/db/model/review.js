const mysql = require('../../../config/connection')
const upload = require('../../lib/s3Connect')

const moment = require('moment')

exports.writeReview = function writeReview(body, file, userId, connection) {
  return new Promise((resolve, reject) => {
    const Query = 'INSERT INTO REVIEW(review_grade, review_content, review_image, ex_id, user_id) values(?,?,?,?,?)'
    connection.query(Query, [Number(body.reviewGrade), body.reviewContent, file.location, body.exId, userId], (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

exports.getReview = function getReview(query, connection) {
  return new Promise((resolve, reject) => {
    const { exId } = query
    const Query = 'SELECT rv.ex_id, rv.review_id, rv.review_date, rv.review_grade, rv.review_image, rv.review_content, us.user_id, us.user_nickname, us.user_profile FROM REVIEW as rv INNER JOIN USER as us on rv.user_id = us.user_id where ex_id = ?'
    connection.query(Query, [exId], (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

exports.updateReview = function updateReview(body, file, userId, connection) {
  return new Promise((resolve, reject) => {
    const Query = 'UPDATE REIVEW SET review_grade = ?, review_content = ?, review_image = ?, review_date = ? WHERE review_id = ? AND user_id = ?'
    connection.query(Query, [Number(body.reviewGrade), moment().format('YYYYMMDD'), body.reviewContent, file.location,  body.exId, userId], (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}


exports.deleteReview = function deleteReview(reviewId, userId, connection) {
  return new Promise((resolve, reject) => {
    const Query = 'delete from REVIEW where review_id = ? and user_id = ?'
    connection.query(Query, [reviewId, userId], (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}




exports.getTotalReviewCount = (exId, connection) => {
  return new Promise((resolve, reject) => {
    const Query = 'select count(review_id) as grade_count from REVIEW where review_grade is NOT NULL and ex_id = ?'
    connection.query(Query, exId, (err, data) => {
      if(err) {
        reject('select All Review Count Query Error')
      } else {
        resolve(data[0])
      }
    })
  })
}

exports.getGroupGradeCount = (exId, connection) => {
  return new Promise((resolve, reject) => {
    const Query = 'select review_grade, count(review_grade) as count from REVIEW where ex_id = ? group by review_grade;'
    connection.query(Query, exId, (err, data) => {
      if(err) {
        reject('select Reivew Grade Group Query Error')
      } else {
        resolve(data)
      }
    })
  })
}

exports.getExReviewLimit3 = (exId, connection) => {
  return new Promise((resolve, reject) => {
    const Query = 'select review_id, review_date, review_grade, review_content, review_image, user_nickname, user_profile from REVIEW, USER where REVIEW.user_id = USER.user_id order by review_date DESC limit 3'
    connection.query(Query, (err, data) => {
      if(err) {
        reject('select Reivew Limit 3 Query Error')
      } else {
        resolve(data)
      }
    })
  })
}