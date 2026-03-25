import styles from '../styles/home/career.module.css'

export default function Career() {
  return (
    <div className={styles.career}>
      <table>
        <thead>
          <tr>
            <th scope="col">
              Start<br />
              (year)
            </th>
            <th scope="col">
              End<br />
              (year)
            </th>
            <th scope="col">Role</th>
          </tr>
        </thead>
        <tbody>
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
        </tbody>
      </table>
    </div>
  )
}
