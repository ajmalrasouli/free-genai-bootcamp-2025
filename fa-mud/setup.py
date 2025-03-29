from setuptools import setup, find_packages

setup(
    name="fa-mud",
    version="0.1.0",
    packages=find_packages(include=['game', 'game.*']),
    include_package_data=True,
    install_requires=[
        "textual>=0.52.1",
        "hazm>=0.9.2",
        "pytest>=7.4.0",
        "numpy>=1.26.0",
        "arabic-reshaper>=3.0.0",
        "python-bidi>=0.4.2",
        "flask",
        "gunicorn"
    ],
) 