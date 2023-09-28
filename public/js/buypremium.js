document.getElementById('rez-button1').onclick = async function (e) {
    const token = localStorage/getItem('token')
    const response = await axios.get('http://localhost:3000/purchase/premiummembership', { headers:{"Authorization" : token}});
    console.log(response);
}