import styles from '../styles/home/career.module.css'

export default function Career() {
  return (
    <div className={styles.career}>
      <table>
        <tr>
          <th>
            Start<br></br>
            (year)
          </th>
          <th>
            End<br></br>
            (year)
          </th>
          <th>Role</th>
        </tr>
        <tr>
          <td>2019</td>
          <td>-</td>
          <td>iOSエンジニア</td>
        </tr>
        <tr>
          <td>2014</td>
          <td>2019</td>
          <td>金融系システムエンジニア</td>
        </tr>
      </table>
    </div>
  )
}
